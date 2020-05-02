import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import {
  mapping,
  light as lightTheme,
  dark as darkTheme,
} from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

// Context
import { AuthProvider } from '../context/auth-context';
import { UserProvider } from '../context/user-context';

// Extracting the ApplicationProvider like this allows for use of the useColorScheme hook
// (since that hook is only available to children of the AppearanceProvider component).
// Thus, the theme will update whenever the user changes their device's color scheme.
const ApplicationWithThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();

  return (
    <ApplicationProvider
      mapping={mapping}
      theme={colorScheme === 'dark' ? darkTheme : lightTheme}
    >
      {children}
    </ApplicationProvider>
  );
};

const AppProviders = ({ children }) => (
  <AuthProvider>
    <UserProvider>
      <AppearanceProvider>
        <ActionSheetProvider>
          <ApplicationWithThemeProvider>
            <IconRegistry icons={EvaIconsPack} />
            <SafeAreaProvider>{children}</SafeAreaProvider>
          </ApplicationWithThemeProvider>
        </ActionSheetProvider>
      </AppearanceProvider>
    </UserProvider>
  </AuthProvider>
);

export default AppProviders;
