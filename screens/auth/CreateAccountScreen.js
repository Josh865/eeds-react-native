import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Input, Layout } from '@ui-kitten/components';

import { AuthContext } from '../../AuthContext';

const createAccountSchema = Yup.object({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Required'),
  city: Yup.string().required('Required'),
  state: Yup.string().required('Required')
  // degree: Yup.mixed().required('Required'),
  // specialty: Yup.mixed().required('Required')
});

const CreateAccountScreen = ({ navigation }) => {
  const { signUp } = useContext(AuthContext);

  const [degrees, setDegrees] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [selectedDegree, setSelectedDegree] = useState({
    Degree_ID: '',
    Degree_Name: ''
  });
  const [selectedSpecialty, setSelectedSpecialty] = useState({
    Specialty_ID: '',
    Specialty_Name: ''
  });

  const [userInfo, setUserInfo] = useState({
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

  // TODO: Fetch specialties when degree changes. These will get passed to the modal screen for
  // display.
  useEffect(() => {
    // Update Formik values

    // Clear existing specialty since it may not be compatible with new degree
    // setFieldValue('specialtyId', null); // Formik
    setSelectedSpecialty({ Specialty_ID: '', Specialty_Name: '' });

    // Get specialties available for selected degree
    axios
      .get(
        `https://www.eeds.com/ajax_functions.aspx?Function_ID=88&Degree_ID=${selectedDegree.Degree_ID}`
      )
      .then(({ data }) => setSpecialties(data));
  }, [selectedDegree.Degree_ID]);

  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        city: '',
        state: '',
        degreeId: '',
        specialtyId: ''
      }}
      validationSchema={createAccountSchema}
      onSubmit={values => console.log(values)}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldValue,
        setFieldError
      }) => (
        <Layout style={{ flex: 1, paddingHorizontal: 16, paddingTop: 24 }}>
          <Input
            value={values.firstName}
            placeholder="First Name"
            caption={
              errors.firstName && touched.firstName ? errors.firstName : ''
            }
            status={errors.firstName && touched.firstName ? 'danger' : 'basic'}
            size="large"
            onChangeText={handleChange('firstName')}
            onBlur={handleBlur('firstName')}
          />

          <Input
            value={values.lastName}
            placeholder="Last Name"
            caption={errors.lastName && touched.lastName ? errors.lastName : ''}
            status={errors.lastName && touched.lastName ? 'danger' : 'basic'}
            size="large"
            onChangeText={handleChange('lastName')}
            onBlur={handleBlur('lastName')}
          />

          <Input
            value={values.email}
            placeholder="Email"
            caption={errors.email && touched.email ? errors.email : ''}
            status={errors.email && touched.email ? 'danger' : 'basic'}
            size="large"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
          />

          <Layout style={{ flexDirection: 'row', marginHorizontal: -2 }}>
            <Layout style={{ flex: 1, paddingHorizontal: 2 }}>
              <Input
                value={values.city}
                placeholder="City"
                caption={errors.city && touched.city ? errors.city : ''}
                status={errors.city && touched.city ? 'danger' : 'basic'}
                size="large"
                onChangeText={handleChange('city')}
                onBlur={handleBlur('city')}
              />
            </Layout>
            <Layout style={{ width: 150, paddingHorizontal: 2 }}>
              <Input
                value={values.state}
                placeholder="State"
                caption={errors.state && touched.state ? errors.state : ''}
                status={errors.state && touched.state ? 'danger' : 'basic'}
                size="large"
                onChangeText={handleChange('state')}
                onBlur={handleBlur('state')}
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
                    setFieldValue,
                    setSelectedDegree
                  })
                }
              >
                {selectedDegree.Degree_Name
                  ? selectedDegree.Degree_Name
                  : 'Select Degree'}
              </Button>
            </Layout>
            <Layout style={{ flex: 1, paddingHorizontal: 2 }}>
              <Button
                status="basic"
                disabled={!selectedDegree.Degree_ID}
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

          <Button style={{ marginTop: 12 }} onPress={handleSubmit}>
            Create Account
          </Button>
        </Layout>
      )}
    </Formik>
  );
};

export default CreateAccountScreen;
