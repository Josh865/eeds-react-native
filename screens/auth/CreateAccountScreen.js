import React from 'react';
import { Button, Text, TextInput, View } from 'react-native';

import { AuthContext } from '../../AuthContext';

const CreateAccountScreen = ({ navigation }) => {
  const { signUp } = React.useContext(AuthContext);
  const [userInfo, setUserInfo] = React.useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const handleInput = (key, val) => {
    setUserInfo({
      ...userInfo,
      [key]: val
    });
  };

  return (
    <View>
      <Text>Create an Account</Text>
      <TextInput
        placeholder="First Name"
        value={userInfo.firstName}
        onChangeText={val => handleInput('firstName', val)}
      />
      <TextInput
        placeholder="Last Name"
        value={userInfo.lastName}
        onChangeText={val => handleInput('lastName', val)}
      />
      <TextInput
        placeholder="Email"
        value={userInfo.email}
        onChangeText={val => handleInput('email', val)}
      />
      <Button title="Sign Up" onPress={signUp} />
      <Text>{JSON.stringify(userInfo)}</Text>
    </View>
  );
};

export default CreateAccountScreen;
