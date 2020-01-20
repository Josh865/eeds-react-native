import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import WebViewScreen from '../screens/WebViewScreen';

const Stack = createStackNavigator();

export const AppNavigator = props => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="WebView" component={WebViewScreen} />
  </Stack.Navigator>
);

export default AppNavigator;
