import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SelectLogInMethodScreen from '../screens/auth/SelectLogInMethodScreen';
import LogInScreen from '../screens/auth/LogInScreen';
import ConfirmNameScreen from '../screens/auth/ConfirmNameScreen';
import CreateAccountScreen from '../screens/auth/CreateAccountScreen';
// import AwaitingApprovalScreen from '../screens/auth/AwaitingApprovalScreen';

const Stack = createStackNavigator();

export const AuthNavigator = props => {
  return (
    <Stack.Navigator {...props}>
      <Stack.Screen
        name="SelectLogInMethod"
        component={SelectLogInMethodScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="LogIn" component={LogInScreen} />
      <Stack.Screen
        name="ConfirmName"
        component={ConfirmNameScreen}
        options={{ title: 'Confirm Your Name' }}
      />
      <Stack.Screen
        name="CreateAccount"
        component={CreateAccountScreen}
        options={{ title: 'Create an Account' }}
      />
      {/* <Stack.Screen
        name="AwaitingApproval"
        component={AwaitingApprovalScreen}
      /> */}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
