import React, { useEffect } from 'react';
import { Button, FlatList, Modal, Text, TextInput, View } from 'react-native';
import axios from 'axios';

import { AuthContext } from '../../AuthContext';

const CreateAccountScreen = ({ navigation }) => {
  const { signUp } = React.useContext(AuthContext);

  const [degreeModalVisible, setDegreeModalVisible] = React.useState(false);
  const [specialtyModalVisible, setSpecialtyModalVisible] = React.useState(
    false
  );

  const [degrees, setDegrees] = React.useState([]);
  const [specialties, setSpecialties] = React.useState([]);
  const [userInfo, setUserInfo] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    degree: {
      Degree_ID: null,
      Degree_Name: ''
    },
    specialty: {
      Specialty_ID: null,
      Specialty_Name: ''
    }
  });

  const handleInput = (key, val) => {
    setUserInfo({
      ...userInfo,
      [key]: val
    });
  };

  // Fetch degrees on load
  useEffect(() => {
    axios
      .get(`https://www.eeds.com/ajax_functions.aspx?Function_ID=142`)
      .then(({ data }) => setDegrees(data));
  }, []);

  // Fetch specialties when degree changes
  useEffect(() => {
    // Clear existing specialty since it may not be compatible with new degree
    setUserInfo({
      ...userInfo,
      specialty: {
        Specialty_ID: null,
        Specialty_Name: ''
      }
    });

    axios
      .get(
        `https://www.eeds.com/ajax_functions.aspx?Function_ID=88&Degree_ID=${userInfo.degree.Degree_ID}`
      )
      .then(({ data }) => setSpecialties(data));
  }, [userInfo.degree]);

  const renderItemDegree = ({ item }) => (
    <Text
      style={{ fontSize: 16, marginBottom: 12 }}
      onPress={() => {
        handleInput('degree', item);
        setDegreeModalVisible(false);
      }}
    >
      {item.Degree_Name}
    </Text>
  );

  const renderItemSpecialty = ({ item }) => (
    <Text
      style={{ fontSize: 16, marginBottom: 12 }}
      onPress={() => {
        handleInput('specialty', item);
        setSpecialtyModalVisible(false);
      }}
    >
      {item.Specialty_Name}
    </Text>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Degree Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={degreeModalVisible}
      >
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text>Hello World!</Text>
          <FlatList
            data={degrees}
            renderItem={renderItemDegree}
            keyExtractor={item => item.Degree_ID.toString()}
            style={{ width: '100%' }}
          />
        </View>
      </Modal>

      {/* Specialty Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={specialtyModalVisible}
      >
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text>Hello World!</Text>
          <FlatList
            data={specialties}
            renderItem={renderItemSpecialty}
            keyExtractor={item => item.Specialty_ID.toString()}
            style={{ width: '100%' }}
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

      <Button
        title="Select Degree"
        onPress={() => setDegreeModalVisible(true)}
      />
      <Button
        title="Select Specialty"
        disabled={!userInfo.degree.Degree_ID}
        onPress={() => setSpecialtyModalVisible(true)}
      />

      <Button title="Sign Up" onPress={signUp} />
      <Text>{JSON.stringify(userInfo)}</Text>
    </View>
  );
};

export default CreateAccountScreen;
