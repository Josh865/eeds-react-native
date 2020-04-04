import React from 'react';
import { AsyncStorage } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

// Navigators
import AuthNavigator from './navigation/AuthNavigator';
import AppNavigator from './navigation/AppNavigator';

// Components
import AppProviders from './components/AppProviders';
import FullPageSpinner from './components/FullPageSpinner';

// Utilities
import getApprovedAccountPin from './utils/getApprovedAccountPin';
import createAccount from './utils/createAccount';

const App = ({ navigation }) => {
  const reducer = (prevState, action) => {
    switch (action.type) {
      case 'RESTORE_PIN':
        return {
          ...prevState,
          pin: action.pin,
          isLoading: false,
        };
      case 'SIGN_IN':
        return {
          ...prevState,
          pin: action.pin,
        };
      case 'SIGN_OUT':
        return {
          ...prevState,
          pin: null,
        };
      case 'SET_AWAITING_APPROVAL':
        return {
          ...prevState,
          awaitingApproval: action.awaitingApproval,
        };
    }
  };

  const [state, dispatch] = React.useReducer(reducer, {
    // Initial state
    isLoading: true,
    pin: null,
    awaitingApproval: false,
  });

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
    signUp: async userInput => {
      await createAccount(userInput);

      // Store user info on device so we can retrieve it later
      await AsyncStorage.multiSet([
        ['lastName', userInput.Last_Name],
        ['email', userInput.Email],
        ['awaitingApproval', 'true'],
      ]);

      // Dispatch action to set component state
      dispatch({ type: 'SET_AWAITING_APPROVAL', awaitingApproval: true });

      // Resolve a promise so anything waiting on this will know it's finished
      return Promise.resolve();
    },
  };

  return (
    <AppProviders authContext={authContext}>
      <NavigationContainer>
        {state.isLoading ? (
          // We haven't finished checking for the pin yet
          <FullPageSpinner />
        ) : !state.pin ? (
          // No pin found, user isn't signed in (account could be awaiting approval)
          <AuthNavigator />
        ) : (
          // User is signed in
          <AppNavigator />
        )}
      </NavigationContainer>
    </AppProviders>
  );
};

export default App;
