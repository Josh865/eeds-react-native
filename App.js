import React from 'react';
import { AsyncStorage, Text, View } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import axios from 'axios';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { mapping, light, dark } from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

// Context
import { AuthContextProvider } from './AuthContext';
import { ThemeContext } from './themeContext';

// Navigators
import AuthNavigator from './navigation/AuthNavigator';
import AppNavigator from './navigation/AppNavigator';

// Screens
import AwaitingApprovalScreen from './screens/auth/AwaitingApprovalScreen';

const themes = { light, dark };

const SplashScreen = () => (
  <View>
    <Text>Loading...</Text>
  </View>
);

export default function App({ navigation }) {
  const [theme, setTheme] = React.useState('dark');
  const currentTheme = themes[theme];

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  const reducer = (prevState, action) => {
    console.log(`action: ${JSON.stringify(action)}`);
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
      case 'SET_AWAITING_APPROVAL':
        return {
          ...prevState,
          awaitingApproval: action.awaitingApproval
        };
    }
  };

  const [state, dispatch] = React.useReducer(reducer, {
    // Initial state
    isLoading: true,
    pin: null,
    awaitingApproval: false
  });

  const getApprovedAccountPin = () => {
    return new Promise(async resolve => {
      // We'll have their last name and email if they created an account in the app
      const lastName = await AsyncStorage.getItem('lastName');
      const email = await AsyncStorage.getItem('email');

      // This will give us the PIN (if approved) or an empty string
      const pin = await axios
        .get(
          `https://www.eeds.com/ajax_functions.aspx?Function_ID=58&Exclude_Results_if_in_Temp_Table=true&Last_Name=${lastName}&Email=${email}`
        )
        .then(response => response.data);

      // Resolve the promise with the PIN (or empty string)
      resolve(pin);
    });
  };

  // As soon as the user opens the app, try to get their credentials
  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let pin;

      // First, try to retrieve the user's PIN from their device. If they've
      // used the app before (and haven't logged out), we should have it.
      pin = await AsyncStorage.getItem('pin');

      // If we don't have their PIN in storage and they created an account in the app,
      // check to see if the account has been approved (and therefore assigned a PIN)
      const isAwaitingApproval = await AsyncStorage.getItem('awaitingApproval');

      if (isAwaitingApproval === 'true') {
        dispatch({ type: 'SET_AWAITING_APPROVAL', awaitingApproval: true });

        pin = await getApprovedAccountPin();
      }

      // TODO: After restoring pin, we may need to validate it in production apps

      // If we found a PIN, the uer's account is clearly not awaiting approval (maybe it
      // never was to begin with, but it doesn't hurt to explicitly set this to false
      // either way).
      if (pin) {
        dispatch({ type: 'SET_AWAITING_APPROVAL', awaitingApproval: false });

        await AsyncStorage.setItem('awaitingApproval', 'false');
      }

      // This will switch to the App screen or Auth screen depending on whether we were
      // able to find the user's PIN. If the value of pin is still null, the user will be
      // sent to the auth path. If we found a PIN, they'll be sent to the app path.
      dispatch({ type: 'RESTORE_PIN', pin: pin });
    };

    // Uncomment to mimic loading delay
    // setTimeout(() => bootstrapAsync(), 4000);
    bootstrapAsync();
  }, []);

  const authContext = {
    awaitingApproval: state.awaitingApproval,
    signIn: async pin => {
      // await AsyncStorage.setItem('pin', pin);

      dispatch({ type: 'SIGN_IN', pin: pin });
    },
    signOut: async () => {
      await AsyncStorage.removeItem('pin');

      dispatch({ type: 'SIGN_OUT' });
    },
    signUp: async userInfo => {
      await AsyncStorage.setItem('awaitingApproval', 'true');
      dispatch({ type: 'SET_AWAITING_APPROVAL', awaitingApproval: true });
      return;

      // Instantiate a FormData object where we'll store all of the data we need to send
      // to the server to create the user's account.
      const formData = new FormData();

      // Add the data the user entered to the FormData object
      for (const [key, value] of Object.entries(userInfo)) {
        formData.append(key, value);
      }

      // Add entries for internal use to FormData object
      formData.append('Function_ID', '6');
      formData.append('deviceToken', 'iPhone_App_User');

      // Send the data to the server to create the user's account.
      axios
        .post('https://www.eeds.com/ajax_functions.aspx', formData)
        .then(async () => {
          await AsyncStorage.multiSet([
            ['lastName', formData.Last_Name],
            ['email', formData.Email],
            ['awaitingApproval', 'true']
          ]);
        });

      dispatch({ type: 'WAIT' });
    }
  };

  return (
    <AuthContextProvider value={authContext}>
      <IconRegistry icons={EvaIconsPack} />
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <ApplicationProvider mapping={mapping} theme={currentTheme}>
          <SafeAreaProvider>
            <NavigationNativeContainer>
              {state.isLoading ? (
                // We haven't finished checking for the pin yet
                <SplashScreen />
              ) : !state.pin ? (
                // No pin found, user isn't signed in (account could be awaiting approval)
                <AuthNavigator />
              ) : (
                // User is signed in
                <AppNavigator />
              )}
            </NavigationNativeContainer>

            {/* <NavigationNativeContainer>
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
          </NavigationNativeContainer> */}
          </SafeAreaProvider>
        </ApplicationProvider>
      </ThemeContext.Provider>
    </AuthContextProvider>
  );
}
