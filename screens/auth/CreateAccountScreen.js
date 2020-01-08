import React from 'react';
import {
  Button,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Alert
} from 'react-native';

import { AuthContext } from '../../AuthContext';

const CreateAccountScreen = ({ navigation }) => {
  const { signUp } = React.useContext(AuthContext);
  const [userInfo, setUserInfo] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    degree: {
      Degree_ID: null,
      Degree_Name: ''
    }
  });

  const handleInput = (key, val) => {
    setUserInfo({
      ...userInfo,
      [key]: val
    });
  };

  // We pass this to the modal so that it can update the value of the degree property
  const setDegree = val => {
    setUserInfo({
      ...userInfo,
      degree: val
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
      <Text
        onPress={() =>
          navigation.navigate('DegreeModal', { id: 24, setDegree: setDegree })
        }
      >
        {userInfo.degree.Degree_ID
          ? userInfo.degree.Degree_Name
          : 'Select Degree'}
      </Text>

      {/* <Button
        title="Select Degree"
        onPress={() =>
          navigation.navigate('DegreeModal', { id: 24, setDegree: setDegree })
        }
      /> */}
      <Button title="Sign Up" onPress={signUp} />
      <Text>{JSON.stringify(userInfo)}</Text>
    </View>
  );
};

export default CreateAccountScreen;
