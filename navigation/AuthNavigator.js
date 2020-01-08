import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SelectLogInMethodScreen from '../screens/auth/SelectLogInMethodScreen';
import LogInScreen from '../screens/auth/LogInScreen';
import ConfirmNameScreen from '../screens/auth/ConfirmNameScreen';
import CreateAccountScreen from '../screens/auth/CreateAccountScreen';
// import AwaitingApprovalScreen from '../screens/auth/AwaitingApprovalScreen';

import SelectDegreeModal from '../screens/auth/SelectDegreeModal';

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

const MainStackNav = props => {
  return (
    <MainStack.Navigator {...props}>
      <MainStack.Screen
        name="SelectLogInMethod"
        component={SelectLogInMethodScreen}
      />
      <MainStack.Screen name="LogIn" component={LogInScreen} />
      <MainStack.Screen name="ConfirmName" component={ConfirmNameScreen} />
      <MainStack.Screen name="CreateAccount" component={CreateAccountScreen} />
      {/* <MainStack.Screen
        name="AwaitingApproval"
        component={AwaitingApprovalScreen}
      /> */}
    </MainStack.Navigator>
  );
};

// This includes the main nav flow, as well as modals
const RootStackNav = () => {
  return (
    <RootStack.Navigator mode="modal">
      <RootStack.Screen
        name="Main"
        component={MainStackNav}
        options={{ headerShown: false }}
      />
      <RootStack.Screen name="DegreeModal" component={SelectDegreeModal} />
    </RootStack.Navigator>
  );
};

export const AuthNavigator = props => {
  return <RootStackNav {...props} />;
};

export default AuthNavigator;
