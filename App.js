import * as React from 'react';
import { AsyncStorage, Text, View } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

// Context
import { AuthContextProvider } from './AuthContext';

// Navigators
import AuthNavigator from './navigation/AuthNavigator';
import AppNavigator from './navigation/AppNavigator';

// Screens
import AwaitingApprovalScreen from './screens/auth/AwaitingApprovalScreen';

const SplashScreen = () => (
  <View>
    <Text>Loading...</Text>
  </View>
);

export default function App({ navigation }) {
  const reducer = (prevState, action) => {
    switch (action.type) {
      case 'RESTORE_PIN':
        return {
          ...prevState,
          pin: action.pin,
          isLoading: false
        };
      case 'SIGN_IN':
        return {
          ...prevState,
          pin: action.pin
        };
      case 'SIGN_OUT':
        return {
          ...prevState,
          pin: null
        };
      case 'WAIT':
        return {
          ...prevState,
          pin: null,
          awaitingApproval: true
        };
    }
  };

  const [state, dispatch] = React.useReducer(reducer, {
    isLoading: true,
    pin: null,
    awaitingApproval: false
  });

  // As soon as the user opens the app, try to get their credentials from storage
  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let pin;

      try {
        pin = await AsyncStorage.getItem('pin');
      } catch (e) {
        // Restoring pin failed
      }

      // After restoring pin, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_PIN', pin: pin });

      // TODO: Need to check if account is awaiting approval
    };

    // Uncomment to mimic loading delay
    // setTimeout(() => bootstrapAsync(), 4000);
    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      awaitingApproval: state.awaitingApproval, // Maybe this could jsut be a prop passed from state instead of living in context?
      signIn: async pin => {
        // await AsyncStorage.setItem('pin', pin);

        dispatch({ type: 'SIGN_IN', pin: pin });
      },
      signOut: async () => {
        await AsyncStorage.removeItem('pin');

        dispatch({ type: 'SIGN_OUT' });
      },
      signUp: async data => {
        // In a production app, we need to send user data to server and get a pin
        // We will also need to handle errors if sign up failed
        // After getting pin, we need to persist the pin using `AsyncStorage`
        // In the example, we'll use a dummy pin

        // dispatch({ type: 'SIGN_IN', pin: 'dummy-auth-pin' });
        dispatch({ type: 'WAIT' });
      }
    }),
    []
  );

  return (
    <AuthContextProvider value={authContext}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <SafeAreaProvider>
          <NavigationNativeContainer>
            {state.isLoading ? (
              // We haven't finished checking for the pin yet
              <SplashScreen />
            ) : state.awaitingApproval ? (
              // User created an account that is still awaiting approval.
              // Should we really prevent all further action? What if the user find their
              // existing PIN? What if someone else wants to use their phone to create an
              // account?
              <AwaitingApprovalScreen />
            ) : state.pin == null ? (
              // No pin found, user isn't signed in (account could be awaiting approval)
              <AuthNavigator />
            ) : (
              // User is signed in
              <AppNavigator />
            )}
          </NavigationNativeContainer>
        </SafeAreaProvider>
      </ApplicationProvider>
    </AuthContextProvider>
  );
}
