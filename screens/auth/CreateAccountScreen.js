import React from 'react';
import { Button, FlatList, Modal, Text, TextInput, View } from 'react-native';

import { AuthContext } from '../../AuthContext';

import { degrees } from '../../degrees';

const CreateAccountScreen = ({ navigation }) => {
  const { signUp } = React.useContext(AuthContext);
  const [modalVisible, setModalVisible] = React.useState(false);
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

  const renderItem = ({ item }) => (
    <Text
      style={{ fontSize: 16, marginBottom: 12 }}
      onPress={() => {
        handleInput('degree', item);
        setModalVisible(false);
      }}
    >
      {item.Degree_Name}
    </Text>
  );

  return (
    <View style={{ flex: 1 }}>
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text>Hello World!</Text>
          <FlatList
            data={degrees}
            renderItem={renderItem}
            keyExtractor={item => item.Degree_ID.toString()}
            style={{ width: '100%' }}
          />

          <Button
            title="Hide Modal"
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          />
        </View>
      </Modal>

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

      <Button title="Select Degree" onPress={() => setModalVisible(true)} />

      <Button title="Sign Up" onPress={signUp} />
      <Text>{JSON.stringify(userInfo)}</Text>
    </View>
  );
};

export default CreateAccountScreen;
