import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { mapping, light, dark } from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Appearance } from 'react-native-appearance';

// Context
import { AuthContextProvider } from '../AuthContext';

// Determine which UI theme object to use for our app based on the user's device theme.
const theme = Appearance.getColorScheme() === 'dark' ? dark : light;

const AppProviders = ({ authContext, children }) => (
  <AuthContextProvider value={authContext}>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider mapping={mapping} theme={theme}>
      <SafeAreaProvider>{children}</SafeAreaProvider>
    </ApplicationProvider>
  </AuthContextProvider>
);

export default AppProviders;
