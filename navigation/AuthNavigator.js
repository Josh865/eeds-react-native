import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SelectLogInMethodScreen from '../screens/auth/SelectLogInMethodScreen';
import LogInScreen from '../screens/auth/LogInScreen';
import ConfirmNameScreen from '../screens/auth/ConfirmNameScreen';
import CreateAccountScreen from '../screens/auth/CreateAccountScreen';
import SelectDegreeModal from '../screens/auth/SelectDegreeModal';
import SelectSpecialtyModal from '../screens/auth/SelectSpecialtyModal';

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

const MainStackNavigator = () => (
  <MainStack.Navigator headerMode="none">
    <MainStack.Screen
      name="SelectLogInMethod"
      component={SelectLogInMethodScreen}
    />
    <MainStack.Screen name="LogIn" component={LogInScreen} />
    <MainStack.Screen name="ConfirmName" component={ConfirmNameScreen} />
    <MainStack.Screen name="CreateAccount" component={CreateAccountScreen} />
  </MainStack.Navigator>
);

// For our modal screens to appear correctly, we use nested navigators. This looks a bit
// confusing, but it's all explained well in the React Navigation docs at
// https://reactnavigation.org/docs/en/next/modal.html
const AuthNavigator = () => (
  <RootStack.Navigator mode="modal" headerMode="none">
    {/* Pass the main stack navigator as a component. */}
    <RootStack.Screen name="Main" component={MainStackNavigator} />

    {/* Modal screens.  */}
    <RootStack.Screen name="DegreeModal" component={SelectDegreeModal} />
    <RootStack.Screen name="SpecialtyModal" component={SelectSpecialtyModal} />
  </RootStack.Navigator>
);

export default AuthNavigator;
