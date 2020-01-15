import React, { useEffect } from 'react';
import axios from 'axios';
import { Button, Input, Layout, Text } from '@ui-kitten/components';

import { AuthContext } from '../../AuthContext';

const CreateAccountScreen = ({ navigation }) => {
  const { signUp } = React.useContext(AuthContext);

  const [degrees, setDegrees] = React.useState([]);
  const [specialties, setSpecialties] = React.useState([]);
  const [userInfo, setUserInfo] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    state: '',
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

  // Fetch degrees on load. These will get passed to the modal screen for display.
  useEffect(() => {
    axios
      .get(`https://www.eeds.com/ajax_functions.aspx?Function_ID=142`)
      .then(({ data }) => setDegrees(data));
  }, []);

  // Fetch specialties when degree changes. These will get passed to the modal screen for
  // display.
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

  return (
    <Layout style={{ flex: 1, paddingHorizontal: 16, paddingTop: 24 }}>
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
        keyboardType="email-address"
        onChangeText={val => handleInput('email', val)}
      />

      <Layout style={{ flexDirection: 'row', marginHorizontal: -2 }}>
        <Layout style={{ flex: 1, paddingHorizontal: 2 }}>
          <Input
            size="large"
            placeholder="City"
            value={userInfo.city}
            onChangeText={val => handleInput('city', val)}
          />
        </Layout>
        <Layout style={{ width: 150, paddingHorizontal: 2 }}>
          <Input
            size="large"
            placeholder="State"
            value={userInfo.state}
            onChangeText={val => handleInput('state', val)}
          />
        </Layout>
      </Layout>

      <Layout style={{ flexDirection: 'row', marginHorizontal: -2 }}>
        <Layout style={{ width: 150, paddingHorizontal: 2 }}>
          <Button
            status="basic"
            onPress={() =>
              navigation.navigate('DegreeModal', {
                degrees,
                userInfo,
                setUserInfo
              })
            }
          >
            {userInfo.degree.Degree_ID
              ? userInfo.degree.Degree_Name
              : 'Select Degree'}
          </Button>
        </Layout>
        <Layout style={{ flex: 1, paddingHorizontal: 2 }}>
          <Button
            status="basic"
            disabled={!userInfo.degree.Degree_ID}
            onPress={() =>
              navigation.navigate('SpecialtyModal', {
                specialties,
                userInfo,
                setUserInfo
              })
            }
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
    </Layout>
  );
};

export default CreateAccountScreen;
