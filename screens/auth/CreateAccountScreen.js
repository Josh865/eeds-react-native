import React, { useContext, useEffect, useState } from 'react';
import { Alert, Modal, TouchableOpacity, View, StyleSheet } from 'react-native';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Divider,
  Icon,
  Input,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction
} from '@ui-kitten/components';
import { StackActions } from '@react-navigation/routers';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appearance } from 'react-native-appearance';

// Context
import { AuthContext } from '../../AuthContext';

// SVG
import SignUp from '../../assets/signup.svg';

// Validation schema used by Formik to make sure the user enters valid data.
const createAccountSchema = Yup.object({
  // First_Name: Yup.string().required('Required'),
  // Last_Name: Yup.string().required('Required'),
  // Email: Yup.string()
  //   .email('Invalid email address')
  //   .required('Required'),
  // ZIP: Yup.string().required('Required'),
  // Degree_ID: Yup.mixed().required('Required'),
  // Specialty_ID: Yup.mixed().required('Required')
});

// Detect which theme the user's device is using
const deviceThemeSetting = Appearance.getColorScheme();

const keyboardAppearance = deviceThemeSetting === 'dark' ? 'dark' : 'default';

const CreateAccountScreen = ({ navigation }) => {
  const { signUp } = useContext(AuthContext);

  const [degrees, setDegrees] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [signUpComplete, setSignUpComplete] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

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

  const createAccount = async data => {
    setIsBusy(true);

    // Call the signUp method we import from AuthContext. This handles the actual account
    // creation.
    await signUp(data);

    // Show a modal thanking the user for signing up and letting them know we'll email
    // them once their account is ready to use.
    setModalVisible(true);

    setIsBusy(false);

    // This will hide the form behind the modal so it doesn't show up during the
    // transition back to the home screen.
    setSignUpComplete(true);
  };

  // When the user closes the modal, they're sent back to the home screen.
  const closeModal = () => {
    setModalVisible(false);

    navigation.dispatch(StackActions.popToTop());
  };

  const BackAction = () => (
    <TopNavigationAction
      icon={style => <Icon {...style} name="arrow-back" />}
      onPress={() => navigation.goBack()}
    />
  );

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <Layout style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
              <Layout style={{ flex: 1, paddingHorizontal: 16 }}>
                <Layout
                  style={{ flexDirection: 'row', justifyContent: 'center' }}
                >
                  <SignUp width={200} height={200} />
                </Layout>
                <Text category="h3">Thanks for signing up!</Text>
                <Text category="p1" style={{ marginTop: 15 }}>
                  We're reviewing your information to make sure you have access
                  to all of your CE credits. We'll send you an email when your
                  account is ready to use.
                </Text>
                <Button
                  appearance="ghost"
                  style={{ marginTop: 12 }}
                  onPress={closeModal}
                >
                  Return Home
                </Button>
              </Layout>
            </SafeAreaView>
          </Layout>
        </Modal>

        {!signUpComplete ? (
          <>
            <TopNavigation
              title="Create an Account"
              alignment="center"
              leftControl={BackAction()}
            />
            <Divider />
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
              onSubmit={values => createAccount(values)}
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
                <Layout
                  style={{ flex: 1, paddingHorizontal: 16, paddingTop: 24 }}
                >
                  <Input
                    value={values.First_Name}
                    placeholder="First Name"
                    caption={
                      errors.First_Name && touched.First_Name
                        ? errors.First_Name
                        : ''
                    }
                    status={
                      errors.First_Name && touched.First_Name
                        ? 'danger'
                        : 'basic'
                    }
                    size="large"
                    keyboardAppearance={keyboardAppearance}
                    onChangeText={handleChange('First_Name')}
                    onBlur={handleBlur('First_Name')}
                  />

                  <Input
                    value={values.Last_Name}
                    placeholder="Last Name"
                    caption={
                      errors.Last_Name && touched.Last_Name
                        ? errors.Last_Name
                        : ''
                    }
                    status={
                      errors.Last_Name && touched.Last_Name ? 'danger' : 'basic'
                    }
                    size="large"
                    style={{ marginTop: 12 }}
                    keyboardAppearance={keyboardAppearance}
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
                    keyboardAppearance={keyboardAppearance}
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
                    keyboardAppearance={keyboardAppearance}
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
                        activeOpacity={1} // Prevent input from fading when pressed
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
                        {/* Absolutely position a transparent View with a higher zIndex
                        over the input so that it "blocks" the input. This effectively
                        prevents the user from interacting with the Input itself so that
                        we can treat it like a button but it gets the same styling as
                        the other inputs on the page. */}
                        <View
                          style={{
                            ...StyleSheet.absoluteFill,
                            zIndex: 10
                          }}
                        />
                        <Input
                          value={selectedDegree.Degree_Name}
                          placeholder="Degree"
                          size="large"
                          pointerEvents="none" // This handles disabling the input for iOS but not Android
                          caption={
                            errors.Degree_ID && touched.Degree_ID
                              ? errors.Degree_ID
                              : ''
                          }
                          status={
                            errors.Degree_ID && touched.Degree_ID
                              ? 'danger'
                              : 'basic'
                          }
                          style={{ zIndex: 1 }}
                        />
                      </TouchableOpacity>
                    </Layout>
                    <Layout style={{ flex: 1, paddingHorizontal: 2 }}>
                      <TouchableOpacity
                        activeOpacity={1} // Prevent input from fading when pressed
                        disabled={!selectedDegree.Degree_ID}
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
                        <View
                          style={{
                            ...StyleSheet.absoluteFill,
                            zIndex: 100
                          }}
                        />
                        <Input
                          value={selectedSpecialty.Specialty_Name}
                          disabled={!selectedDegree.Degree_ID}
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
                          style={{ zIndex: 1 }}
                        />
                      </TouchableOpacity>
                    </Layout>
                  </Layout>

                  {isBusy ? (
                    <Text>Loading...</Text>
                  ) : (
                    <Button style={{ marginTop: 12 }} onPress={handleSubmit}>
                      Create Account
                    </Button>
                  )}
                </Layout>
              )}
            </Formik>
          </>
        ) : null}
      </SafeAreaView>
    </Layout>
  );
};

export default CreateAccountScreen;
