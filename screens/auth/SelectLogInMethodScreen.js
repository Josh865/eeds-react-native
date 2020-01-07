import React from 'react';
import { Button, Text, View } from 'react-native';

const SelectLogInMethodScreen = ({ navigation }) => {
  const goToLogInScreen = logInMethod => {
    navigation.navigate('LogIn', { logInMethod: logInMethod });
  };

  return (
    <View>
      <Text>How would you like to log in?</Text>
      <Button title="PIN" onPress={() => goToLogInScreen('pin')} />
      <Button title="Email" onPress={() => goToLogInScreen('email')} />
      <Button title="Phone" onPress={() => goToLogInScreen('phone')} />
    </View>
  );
};

export default SelectLogInMethodScreen;
