import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import SignInToEventScreen from '../screens/SignInToEventScreen';

const Stack = createStackNavigator();

export const AppNavigator = props => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="SignInToEvent" component={SignInToEventScreen} />
    <Stack.Screen name="Camera" component={CameraScreen} />
  </Stack.Navigator>
);

export default AppNavigator;
