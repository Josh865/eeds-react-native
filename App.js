import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';

// Navigators
import AuthNavigator from './navigation/AuthNavigator';
import AppNavigator from './navigation/AppNavigator';

// Components
import AppProviders from './components/AppProviders';
import FullPageSpinner from './components/FullPageSpinner';

// Context
import { useAuth } from './context/auth-context';

const Navigator = () => {
  const { busy, pin } = useAuth();

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
