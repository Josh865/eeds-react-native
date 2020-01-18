import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Input, Layout } from '@ui-kitten/components';

import { AuthContext } from '../../AuthContext';

// Validation schema used by Formik to make sure the user enters valid data.
const createAccountSchema = Yup.object({
  First_Name: Yup.string().required('Required'),
  Last_Name: Yup.string().required('Required'),
  Email: Yup.string()
    .email('Invalid email address')
    .required('Required'),
  ZIP: Yup.string().required('Required'),
  Degree_ID: Yup.mixed().required('Required'),
  Specialty_ID: Yup.mixed().required('Required')
});

const CreateAccountScreen = ({ navigation }) => {
  const { signUp } = useContext(AuthContext);

  const [degrees, setDegrees] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  // Formik is used to handle the form state, but we have to treat the selected degree
  // and specialty a bit differently since the form value is just the ID, but we need
  // the name to display to the user.
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
        setFieldTouched
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
            style={{ marginTop: 12 }}
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
            style={{ marginTop: 12 }}
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
            style={{ marginTop: 12 }}
            onChangeText={handleChange('ZIP')}
            onBlur={handleBlur('ZIP')}
          />

          <Layout
            style={{
              flexDirection: 'row',
              marginHorizontal: -2,
              marginTop: 12
            }}
          >
            <Layout style={{ width: 150, paddingHorizontal: 2 }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('DegreeModal', {
                    degrees,
                    setFieldValue,
                    setFieldTouched,
                    setSelectedDegree,
                    setSelectedSpecialty
                  })
                }
              >
                <Input
                  value={selectedDegree.Degree_Name}
                  editable={false}
                  placeholder="Degree"
                  size="large"
                  pointerEvents="none"
                  caption={
                    errors.Degree_ID && touched.Degree_ID
                      ? errors.Degree_ID
                      : ''
                  }
                  status={
                    errors.Degree_ID && touched.Degree_ID ? 'danger' : 'basic'
                  }
                />
              </TouchableOpacity>
              {/* <Button
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
              </Button> */}
            </Layout>
            <Layout style={{ flex: 1, paddingHorizontal: 2 }}>
              <TouchableOpacity
                disabled={!selectedDegree.Degree_ID}
                style={{ opacity: selectedDegree.Degree_ID ? 1 : 0.5 }}
                onPress={() =>
                  navigation.navigate('SpecialtyModal', {
                    specialties,
                    setFieldValue,
                    setFieldTouched,
                    setSelectedDegree,
                    setSelectedSpecialty
                  })
                }
              >
                <Input
                  value={selectedSpecialty.Specialty_Name}
                  editable={false}
                  placeholder="Specialty"
                  size="large"
                  pointerEvents="none"
                  caption={
                    errors.Specialty_ID && touched.Specialty_ID
                      ? errors.Specialty_ID
                      : ''
                  }
                  status={
                    errors.Specialty_ID && touched.Specialty_ID
                      ? 'danger'
                      : 'basic'
                  }
                />
              </TouchableOpacity>

              {/* <Button
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
              </Button> */}
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
