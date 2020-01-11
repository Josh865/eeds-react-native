import * as React from 'react';
import { AsyncStorage, Text, View } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
  // The reducer updates the state. The pieces of state it updates and the values it uses
  // are determined by the action that is passed.
  const reducer = (prevState, action) => {
    switch (action.type) {
      case 'RESTORE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false
        };
      case 'SIGN_IN':
        return {
          ...prevState,
          userToken: action.token
        };
      case 'SIGN_OUT':
        return {
          ...prevState,
          userToken: null
        };
      case 'WAIT':
        return {
          ...prevState,
          userToken: null,
          awaitingApproval: true
        };
    }
  };

  const [state, dispatch] = React.useReducer(reducer, {
    isLoading: true,
    userToken: null,
    awaitingApproval: false
  });

  // As soon as the user opens the app, try to get their credentials from storage
  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });

      // TODO: Need to check if account is awaiting approval
    };

    // Uncomment to mimic loading delay
    // setTimeout(() => bootstrapAsync(), 4000);
    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      awaitingApproval: state.awaitingApproval, // Maybe this could jsut be a prop passed from state instead of living in context?
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        // dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
        dispatch({ type: 'WAIT' });
      }
    }),
    []
  );

  return (
    <AuthContextProvider value={authContext}>
      <SafeAreaProvider>
        <NavigationNativeContainer>
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <SplashScreen />
          ) : state.awaitingApproval ? (
            // User created an account that is still awaiting approval.
            // Should we really prevent all further action? What if the user find their
            // existing PIN? What if someone else wants to use their phone to create an
            // account?
            <AwaitingApprovalScreen />
          ) : state.userToken == null ? (
            // No token found, user isn't signed in (account could be awaiting approval)
            <AuthNavigator />
          ) : (
            // User is signed in
            <AppNavigator />
          )}
        </NavigationNativeContainer>
      </SafeAreaProvider>
    </AuthContextProvider>
  );
}
