import React, { useContext } from 'react';
import { Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import WebViewScreen from '../screens/WebViewScreen';
import { AuthContext } from '../AuthContext';

const Stack = createStackNavigator();

export const AppNavigator = props => {
  const { signOut } = useContext(AuthContext);

  return (
    <Stack.Navigator
      {...props}
      screenOptions={{
        headerRight: () => <Button title="Sign Out" onPress={signOut} />
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="WebView" component={WebViewScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
