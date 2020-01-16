import * as React from 'react';
import { AsyncStorage, Text, View } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import axios from 'axios';
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

  // As soon as the user opens the app, try to get their credentials
  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let pin;

      // First, try to retrieve the user's PIN from their device
      try {
        pin = await AsyncStorage.getItem('pin');
      } catch (e) {
        // Restoring pin failed
      }

      // If we don't have their PIN in storage, check to see if they signed up for an
      // account in the app and it's still awaiting approval
      if (!pin) {
        // We'll have their last name and email if they created an account in the app
        const lastName = await AsyncStorage.getItem('lastName');
        const email = await AsyncStorage.getItem('email');

        if (lastName && email) {
          pin = await axios
            .get(
              `https://www.eeds.com/ajax_functions.aspx?Function_ID=58&Exclude_Results_if_in_Temp_Table=true&Last_Name=${lastName}&Email=${email}`
            )
            .then(response => response);
        }
      }

      // TODO: After restoring pin, we may need to validate it in production apps

      // If we found a PIN, the uer's account is clearly not awaiting approval (if it
      // ever way to begin with)
      if (pin) {
        await AsyncStorage.setItem('awaitingApproval', 'false');
      }

      // This will switch to the App screen or Auth screen depending on whether we were
      // able to find the user's PIN. If the value of pin is still null, the user will be
      // sent to the auth screen. If we found a PIN, they'll be sent into the app.
      dispatch({ type: 'RESTORE_PIN', pin: pin });
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
        console.log('signing up!');
        console.log(JSON.stringify(data));
        return;
        // In a production app, we need to send user data to server and get a pin
        // We will also need to handle errors if sign up failed
        // After getting pin, we need to persist the pin using `AsyncStorage`
        // In the example, we'll use a dummy pin
        axios
          .post('https://www.eeds.com/ajax_functions.aspx', {
            Function_ID: 6,
            deviceToken: 'iPhone_App_User',
            ...data
          })
          .then(async () => {
            await AsyncStorage.setItem('lastName', data.Last_Name);
            await AsyncStorage.setItem('email', data.Email);
            await AsyncStorage.setItem('awaitingApproval', 'true');
          });

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
