import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useNetInfo } from '@react-native-community/netinfo';

// Navigators
import AuthNavigator from './navigation/AuthNavigator';
import AppNavigator from './navigation/AppNavigator';

// Components
import AppProviders from './components/AppProviders';
import ConnectionNotice from './components/ConnectionNotice';
import FullPageSpinner from './components/FullPageSpinner';

// Context
import { useAuth } from './context/auth-context';

const Navigator = () => {
  const netInfo = useNetInfo();
  const { busy, pin } = useAuth();

  // Show notice if no Internet connection is available. Prevents use of app, but will
  // automatically dismiss as soon as connection is detected.
  if (!netInfo.isInternetReachable) {
    return <ConnectionNotice />;
  }

  // While trying to restore the user's credentials, show a spinner
  if (busy) {
    return <FullPageSpinner />;
  }

  // If PIN was found, user gets sent down the authenticated path (<AppNavigator>).
  // If PIN wasn't found, user gets sent down the unauthenticated path (<AuthNavigator>).
  return (
    <NavigationContainer>
      {pin ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AppProviders>
      <Navigator />
    </AppProviders>
  );
};

export default App;
