import React from 'react';
import { AsyncStorage, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import axios from 'axios';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  ApplicationProvider,
  IconRegistry,
  Image,
  Layout,
  Spinner
} from '@ui-kitten/components';
import {
  mapping,
  light as lightTheme,
  dark as darkTheme
} from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Appearance } from 'react-native-appearance';

// Context
import { AuthContextProvider } from './AuthContext';
import { ThemeContext } from './themeContext';

// Navigators
import AuthNavigator from './navigation/AuthNavigator';
import AppNavigator from './navigation/AppNavigator';

// Detect which theme the user's device is using. Returns 'dark' or 'light'.
const deviceThemeSetting = Appearance.getColorScheme();

// Determine which UI theme object to use for our app based on the user's device theme.
const theme = deviceThemeSetting === 'dark' ? darkTheme : lightTheme;

// Display a spinner while the app is being bootstraped
const SplashScreen = () => (
  <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Spinner size="giant" />
  </Layout>
);

const App = ({ navigation }) => {
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
    pin: state.pin,
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
      // Dispatch action to set component state
      dispatch({ type: 'SET_AWAITING_APPROVAL', awaitingApproval: true });

      // Resolve a promise so anything waiting on this will know it's finished
      return new Promise(resolve => resolve());
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
      await axios.post('https://www.eeds.com/ajax_functions.aspx', formData);

      // Store use info on device so we can retrieve it later
      await AsyncStorage.multiSet([
        ['lastName', userInfo.Last_Name],
        ['email', userInfo.Email],
        ['awaitingApproval', 'true']
      ]);

      // Dispatch action to set component state
      dispatch({ type: 'SET_AWAITING_APPROVAL', awaitingApproval: true });

      // Resolve a promise so anything waiting on this will know it's finished
      return new Promise(resolve => resolve());
    }
  };

  return (
    <AuthContextProvider value={authContext}>
      <IconRegistry icons={EvaIconsPack} />
      <ThemeContext.Provider value={{ theme: deviceThemeSetting }}>
        <ApplicationProvider mapping={mapping} theme={theme}>
          <SafeAreaProvider>
            <NavigationContainer>
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
            </NavigationContainer>
          </SafeAreaProvider>
        </ApplicationProvider>
      </ThemeContext.Provider>
    </AuthContextProvider>
  );
};

export default App;
