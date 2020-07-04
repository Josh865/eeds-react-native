import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Divider,
  Icon,
  Layout,
  Spinner,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomTextInput from '../../components/CustomTextInput';
import CustomPicker from '../../components/CustomPicker';

// Context
import { useAuth } from '../../context/auth-context';

// Validation schema used by Formik to make sure the user enters valid data.
const createAccountSchema = Yup.object({
  First_Name: Yup.string().required('Required'),
  Last_Name: Yup.string().required('Required'),
  Email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  ZIP: Yup.string().required('Required'),
  Degree_ID: Yup.mixed().required('Required'),
  Specialty_ID: Yup.mixed().required('Required'),
});

const CreateAccountScreen = ({ navigation, route }) => {
  const { signUp } = useAuth();

  const [degrees, setDegrees] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [isBusy, setIsBusy] = useState(false);

  // Store a ref to Formik so we can access its methods
  const formikRef = useRef();

  // Keep track of which degree is selected so we can update available specialties when
  // selected degree changes.
  const [selectedDegreeId, setSelectedDegreeId] = useState();

  useEffect(() => {
    axios
      .get('https://www.eeds.com/ajax_functions.aspx?Function_ID=142')
      .then(({ data }) => {
        const degreeList = data;

        // Modify the blank degree so that the label/name reads "None"
        degreeList.find(degree => degree.Degree_ID === 50).Degree_Name = 'None';

        setDegrees(degreeList);
      });
  }, []);

  // Fetch specialties when degree changes.
  useEffect(() => {
    // Always reset specialties since new degree may not be compatible with same
    // specialties as old degree.
    setSpecialties([]);

    // Clear previously selected specialty from form.
    formikRef.current.setFieldValue('Specialty_ID', '');

    if (!selectedDegreeId) {
      return;
    }

    axios
      .get(
        `https://www.eeds.com/ajax_functions.aspx?Function_ID=88&Degree_ID=${selectedDegreeId}`
      )
      .then(({ data }) => {
        setSpecialties(data);
      });
  }, [selectedDegreeId]);

  const createAccount = async () => {
    setIsBusy(true);

    // Get the values from the form
    const userInput = formikRef.current.values;

    // Call the signUp method we import from useAuth to create the account.
    await signUp(userInput);

    setIsBusy(false);

    navigation.navigate('CreateAccountComplete');
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
        <TopNavigation
          title="Create an Account"
          alignment="center"
          accessoryLeft={BackAction}
        />
        <Divider />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <Formik
            innerRef={formikRef}
            initialValues={{
              First_Name: '',
              Last_Name: '',
              Email: '',
              ZIP: '',
              Degree_ID: '',
              Specialty_ID: '',
            }}
            validationSchema={createAccountSchema}
            onSubmit={createAccount}
          >
            {({ handleSubmit, isValid }) => (
              <Layout style={styles.formContainer}>
                <CustomTextInput
                  label="First Name"
                  name="First_Name"
                  textContentType="givenName"
                  autoCorrect={false}
                  style={styles.formRow}
                />

                <CustomTextInput
                  label="Last Name"
                  name="Last_Name"
                  textContentType="familyName"
                  autoCorrect={false}
                  style={styles.formRow}
                />

                <CustomTextInput
                  label="Email"
                  name="Email"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.formRow}
                />

                <CustomTextInput
                  label="ZIP Code"
                  name="ZIP"
                  keyboardType="numeric"
                  textContentType="postalCode"
                  autoCorrect={false}
                  style={styles.formRow}
                />

                <CustomPicker
                  items={degrees}
                  labelKey="Degree_Name"
                  valueKey="Degree_ID"
                  label="Degree"
                  name="Degree_ID"
                  prompt="Select Degree"
                  enabled={degrees.length > 0}
                  style={styles.formRow}
                  onChange={setSelectedDegreeId}
                />

                <CustomPicker
                  items={specialties}
                  labelKey="Specialty_Name"
                  valueKey="Specialty_ID"
                  label="Specialty"
                  name="Specialty_ID"
                  prompt="Select Specialty"
                  enabled={specialties.length > 0}
                  style={styles.formRow}
                />

                {/* Swap the button for a spinner while waiting for the request that
                    creates the account to complete. */}
                <Layout
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 24,
                  }}
                >
                  {isBusy ? (
                    <Spinner size="large" />
                  ) : (
                    <Button
                      size="large"
                      style={{ flex: 1 }}
                      disabled={!isValid}
                      onPress={handleSubmit}
                    >
                      Create Account
                    </Button>
                  )}
                </Layout>
              </Layout>
            )}
          </Formik>
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};

export default CreateAccountScreen;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },

  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
});
