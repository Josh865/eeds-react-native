import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SelectLogInMethodScreen from '../screens/auth/SelectLogInMethodScreen';
import LogInScreen from '../screens/auth/LogInScreen';
import CreateAccountScreen from '../screens/auth/CreateAccountScreen';
import CreateAccountCompleteScreen from '../screens/auth/CreateAccountCompleteScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen
      name="SelectLogInMethod"
      component={SelectLogInMethodScreen}
    />
    <Stack.Screen name="LogIn" component={LogInScreen} />
    <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
    <Stack.Screen
      name="CreateAccountComplete"
      component={CreateAccountCompleteScreen}
    />
  </Stack.Navigator>
);

export default AuthNavigator;
