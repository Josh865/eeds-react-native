import React, { useEffect } from 'react';
import { Modal, View } from 'react-native';
import { SafeAreaView, useSafeArea } from 'react-native-safe-area-context';
import axios from 'axios';
import {
  Button,
  Input,
  Layout,
  List,
  ListItem,
  Text
} from '@ui-kitten/components';

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
    <ListItem
      title={item.Degree_Name}
      onPress={() => {
        handleInput('degree', item);
        setDegreeModalVisible(false);
      }}
    />
  );

  const renderItemSpecialty = ({ item }) => (
    <ListItem
      title={item.Specialty_Name}
      onPress={() => {
        handleInput('specialty', item);
        setSpecialtyModalVisible(false);
      }}
    />
  );

  return (
    <Layout style={{ flex: 1 }}>
      {/* Degree Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={degreeModalVisible}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <List
            data={degrees}
            renderItem={renderItemDegree}
            ListHeaderComponent={() => (
              <Text category="h6">Select Your Degree</Text>
            )}
          />
        </SafeAreaView>
      </Modal>

      {/* Specialty Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={specialtyModalVisible}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <List data={specialties} renderItem={renderItemSpecialty} />
        </SafeAreaView>
      </Modal>

      <Layout style={{ flex: 1, paddingHorizontal: 16, marginTop: 24 }}>
        <Input
          size="large"
          placeholder="First Name"
          value={userInfo.firstName}
          onChangeText={val => handleInput('firstName', val)}
        />
        <Input
          size="large"
          placeholder="Last Name"
          value={userInfo.lastName}
          onChangeText={val => handleInput('lastName', val)}
        />
        <Input
          size="large"
          placeholder="Email"
          value={userInfo.email}
          onChangeText={val => handleInput('email', val)}
        />

        <Layout style={{ flexDirection: 'row', marginHorizontal: -2 }}>
          <Layout style={{ width: 150, paddingHorizontal: 2 }}>
            <Button status="basic" onPress={() => setDegreeModalVisible(true)}>
              {userInfo.degree.Degree_ID
                ? userInfo.degree.Degree_Name
                : 'Select Degree'}
            </Button>
          </Layout>
          <Layout style={{ flex: 1, paddingHorizontal: 2 }}>
            <Button
              status="basic"
              disabled={!userInfo.degree.Degree_ID}
              onPress={() => setSpecialtyModalVisible(true)}
            >
              {userInfo.specialty.Specialty_ID
                ? userInfo.specialty.Specialty_Name
                : 'Select Specialty'}
            </Button>
          </Layout>
        </Layout>

        <Button style={{ marginTop: 12 }} onPress={signUp}>
          Create Account
        </Button>
        <Text>{JSON.stringify(userInfo)}</Text>
      </Layout>
    </Layout>
  );
};

export default CreateAccountScreen;
