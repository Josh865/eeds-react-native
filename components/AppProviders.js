import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import {
  mapping,
  light as lightTheme,
  dark as darkTheme,
} from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Appearance } from 'react-native-appearance';

// Context
import { AuthContextProvider } from '../AuthContext';
import { ThemeContext } from '../ThemeContext';

// Determine which UI theme object to use for our app based on the user's device theme.
const theme = Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme;

const AppProviders = ({ authContext, children }) => (
  <AuthContextProvider value={authContext}>
    <IconRegistry icons={EvaIconsPack} />
    <ThemeContext.Provider value={{ theme }}>
      <ApplicationProvider mapping={mapping} theme={theme}>
        <SafeAreaProvider>{children}</SafeAreaProvider>
      </ApplicationProvider>
    </ThemeContext.Provider>
  </AuthContextProvider>
);

export default AppProviders;
