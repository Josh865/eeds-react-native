import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SelectLogInMethodScreen from '../screens/auth/SelectLogInMethodScreen';
import LogInScreen from '../screens/auth/LogInScreen';
import ConfirmNameScreen from '../screens/auth/ConfirmNameScreen';

const Stack = createStackNavigator();

export const AuthNavigator = props => {
  return (
    <Stack.Navigator {...props} headerMode="none">
      <Stack.Screen
        name="SelectLogInMethod"
        component={SelectLogInMethodScreen}
      />
      <Stack.Screen name="LogIn" component={LogInScreen} />
      <Stack.Screen name="ConfirmName" component={ConfirmNameScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
