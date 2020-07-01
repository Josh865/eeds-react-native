import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import SignInToEventScreen from '../screens/SignInToEventScreen';
import ManageAccountScreen from '../screens/ManageAccountScreen';
import WebViewScreen from '../screens/WebViewScreen';
import CameraScreen from '../screens/CameraScreen';

const Stack = createStackNavigator();

export const AppNavigator = props => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="SignInToEvent" component={SignInToEventScreen} />
    <Stack.Screen name="ManageAccount" component={ManageAccountScreen} />
    <Stack.Screen name="WebView" component={WebViewScreen} />
    <Stack.Screen name="Camera" component={CameraScreen} />
  </Stack.Navigator>
);

export default AppNavigator;
