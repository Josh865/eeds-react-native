import React from 'react';
import { YellowBox } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './navigation/AppNavigator';

export default () => {
  // This value is used to determine the initial screen
  const isAuthorized = true;

  return (
    <React.Fragment>
      <SafeAreaProvider>
        <NavigationNativeContainer>
          <AppNavigator initialRouteName={isAuthorized ? 'Home' : 'Auth'} />
        </NavigationNativeContainer>
      </SafeAreaProvider>
    </React.Fragment>
  );
};

// For some reason, starting from 0.61, react-native-gesture-handler throws this warning
// https://github.com/facebook/react-native/issues/26226
YellowBox.ignoreWarnings(['RCTRootView cancelTouches']);
