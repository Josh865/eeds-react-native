import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { mapping, light, dark } from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Appearance } from 'react-native-appearance';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

// Context
import { AuthProvider } from '../context/auth-context';
import { UserProvider } from '../context/user-context';

// Determine which UI theme object to use for our app based on the user's device theme
const theme = Appearance.getColorScheme() === 'dark' ? dark : light;

const AppProviders = ({ children }) => (
  <AuthProvider>
    <UserProvider>
      <ActionSheetProvider>
        <ApplicationProvider mapping={mapping} theme={theme}>
          <IconRegistry icons={EvaIconsPack} />
          <SafeAreaProvider>{children}</SafeAreaProvider>
        </ApplicationProvider>
      </ActionSheetProvider>
    </UserProvider>
  </AuthProvider>
);

export default AppProviders;
