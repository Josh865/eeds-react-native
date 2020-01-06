import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthNavigator } from './AuthNavigator';
import { HomeNavigator } from './HomeNavigator';

const Stack = createStackNavigator();

export const AppNavigator = ({ initialRouteName }) => (
  <Stack.Navigator initialRouteName="Home" headerMode="none">
    <Stack.Screen name="Auth" component={AuthNavigator} />
    <Stack.Screen name="Home" component={HomeNavigator} />
  </Stack.Navigator>
);
