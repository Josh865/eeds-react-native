import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Input, Layout } from '@ui-kitten/components';

import { AuthContext } from '../../AuthContext';

const createAccountSchema = Yup.object({
  First_Name: Yup.string().required('Required'),
  Last_Name: Yup.string().required('Required'),
  Email: Yup.string()
    .email('Invalid email address')
    .required('Required'),
  ZIP: Yup.string().required('Required')
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

  // Fetch degrees on load. These get passed to the modal for display.
  useEffect(() => {
    axios
      .get(`https://www.eeds.com/ajax_functions.aspx?Function_ID=142`)
      .then(({ data }) => setDegrees(data));
  }, []);

  // Fetch specialties when degree changes. These get passed to the modal for display.
  // Note that the dependency object is stringified to simplify comparison. See
  // https://twitter.com/dan_abramov/status/1104414272753487872
  useEffect(() => {
    if (!selectedDegree.Degree_ID) return;

    axios
      .get(
        `https://www.eeds.com/ajax_functions.aspx?Function_ID=88&Degree_ID=${selectedDegree.Degree_ID}`
      )
      .then(({ data }) => setSpecialties(data));
  }, [JSON.stringify(selectedDegree)]);

  return (
    <Formik
      initialValues={{
        First_Name: '',
        Last_Name: '',
        Email: '',
        ZIP: '',
        Degree_ID: '',
        Specialty_ID: ''
      }}
      validationSchema={createAccountSchema}
      onSubmit={values => signUp(values)}
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
            value={values.First_Name}
            placeholder="First Name"
            caption={
              errors.First_Name && touched.First_Name ? errors.First_Name : ''
            }
            status={
              errors.First_Name && touched.First_Name ? 'danger' : 'basic'
            }
            size="large"
            onChangeText={handleChange('First_Name')}
            onBlur={handleBlur('First_Name')}
          />

          <Input
            value={values.Last_Name}
            placeholder="Last Name"
            caption={
              errors.Last_Name && touched.Last_Name ? errors.Last_Name : ''
            }
            status={errors.Last_Name && touched.Last_Name ? 'danger' : 'basic'}
            size="large"
            onChangeText={handleChange('Last_Name')}
            onBlur={handleBlur('Last_Name')}
          />

          <Input
            value={values.Email}
            placeholder="Email"
            caption={errors.Email && touched.Email ? errors.Email : ''}
            status={errors.Email && touched.Email ? 'danger' : 'basic'}
            size="large"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={handleChange('Email')}
            onBlur={handleBlur('Email')}
          />

          <Input
            value={values.ZIP}
            placeholder="ZIP"
            caption={errors.ZIP && touched.ZIP ? errors.ZIP : ''}
            status={errors.ZIP && touched.ZIP ? 'danger' : 'basic'}
            size="large"
            keyboardType="number-pad"
            onChangeText={handleChange('ZIP')}
            onBlur={handleBlur('ZIP')}
          />

          {/* FIXME: TEST */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('DegreeModal', {
                degrees,
                setFieldValue,
                setSelectedDegree,
                setSelectedSpecialty
              })
            }
          >
            <Input
              editable={false}
              pointerEvents="none"
              onTouchStart={() =>
                navigation.navigate('DegreeModal', {
                  degrees,
                  setFieldValue,
                  setSelectedDegree,
                  setSelectedSpecialty
                })
              }
              value={selectedDegree.Degree_Name}
            />
          </TouchableOpacity>

          <Layout style={{ flexDirection: 'row', marginHorizontal: -2 }}>
            <Layout style={{ width: 150, paddingHorizontal: 2 }}>
              <Button
                status="basic"
                onPress={() =>
                  navigation.navigate('DegreeModal', {
                    degrees,
                    setFieldValue,
                    setSelectedDegree,
                    setSelectedSpecialty
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
                    setFieldValue,
                    setSelectedSpecialty
                  })
                }
              >
                {selectedSpecialty.Specialty_Name
                  ? selectedSpecialty.Specialty_Name
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
