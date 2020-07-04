import React, { useRef } from 'react';
import {
  Alert,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { Formik, useField } from 'formik';
import {
  Button,
  Divider,
  Icon,
  Input,
  Layout,
  Spinner,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import { useActionSheet } from '@expo/react-native-action-sheet';

import LogInScreenImage from '../../components/LogInScreenImage';

import { useAuth } from '../../context/auth-context';

// Utils
import getLogInMethodDetails from '../../utils/getLogInMethodDetails';

const CredentialInput = ({ label, ...props }) => {
  // eslint-disable-next-line no-unused-vars
  const [field, meta, helpers] = useField(props);
  const { value, touched, error } = meta;
  const { setValue, setTouched } = helpers;

  return (
    <Input
      value={value}
      caption={touched && error ? error : ''}
      status={touched && error ? 'danger' : 'basic'}
      size="large"
      autoFocus={true}
      autoCorrect={false}
      autoCapitalize="none"
      returnKeyType="go"
      onChangeText={input => setValue(input)}
      onBlur={setTouched}
      {...props}
    />
  );
};

const LogInScreen = ({ route, navigation }) => {
  const { logInMethodName, customField } = route.params;

  const { login } = useAuth();
  const { showActionSheetWithOptions } = useActionSheet();

  const formik = useRef();

  const logInMethod = getLogInMethodDetails(logInMethodName, customField);

  const confirmName = namesArray => {
    // Android get a JS implementation of iOS's native ActionSheet, so we have to
    // manually dismiss the keybaord so that it doesn't appear over the ActionSheet.
    Platform.OS === 'android' ? Keyboard.dismiss() : null;

    return new Promise(resolve => {
      const cancelButtonIndex = namesArray.length;

      showActionSheetWithOptions(
        {
          title: 'Please confirm your name',
          options: [...namesArray, 'Cancel'],
          cancelButtonIndex: cancelButtonIndex,
          containerStyle: { maxHeight: '70%' }, // Android only
        },
        buttonIndex => {
          if (buttonIndex === cancelButtonIndex) {
            resolve();
          }

          resolve(namesArray[buttonIndex]);
        }
      );
    });
  };

  const attemptLogin = async ({ value }) => {
    const accountStatus = await axios
      .get(logInMethod.url + value)
      .then(({ data }) => data);

    if (accountStatus.PIN_Status === false) {
      Alert.alert(
        'Account Not Found',
        `We couldn't find an account associated with the ${logInMethod.label} you entered.`
      );
      formik.current.setSubmitting(false);
      return;
    }

    // Wait for the user to select a name
    const selectedName = await confirmName(accountStatus.Names_Array);

    // If they cancelled the name selection, just return to the form
    if (!selectedName) {
      formik.current.setSubmitting(false);
      return;
    }

    // If they selected the wrong name, let them know
    if (selectedName !== accountStatus.Correct_Name) {
      Alert.alert(
        'Incorrect Name',
        `That isn't the name associated with the ${logInMethod.label} you entered. Please try again.`
      );
      formik.current.setSubmitting(false);
      return;
    }

    // If they selected the correct name, log them in
    login(accountStatus.PIN);
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
          title={`Log In with ${logInMethod.label}`}
          alignment="center"
          accessoryLeft={BackAction}
        />
        <Divider />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
          style={{ flex: 1 }}
        >
          <Layout style={styles.container}>
            <Layout style={{ marginVertical: 20 }}>
              <LogInScreenImage imageUrl={logInMethod.image} />
            </Layout>
            <Formik
              innerRef={formik}
              initialValues={{ value: '' }}
              validationSchema={logInMethod.validationSchema}
              onSubmit={attemptLogin}
            >
              {({ handleSubmit, isSubmitting }) => (
                <>
                  <CredentialInput
                    name="value"
                    placeholder={`Enter Your ${logInMethod.label}`}
                    keyboardType={logInMethod.keyboardType}
                    maxLength={logInMethod?.maxLength || 50}
                    onSubmitEditing={handleSubmit}
                  />
                  {logInMethod.instructions ? (
                    <Text
                      category="c1"
                      appearance="hint"
                      style={styles.instructions}
                    >
                      {logInMethod.instructions}
                    </Text>
                  ) : null}
                  <Layout style={styles.buttonContainer}>
                    {isSubmitting ? (
                      <Spinner size="large" />
                    ) : (
                      <Button size="large" onPress={handleSubmit}>
                        Log In
                      </Button>
                    )}
                  </Layout>
                </>
              )}
            </Formik>
          </Layout>
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};

export default LogInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  instructions: {
    alignSelf: 'flex-start',
    marginTop: 6,
    marginBottom: 12,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },
});
