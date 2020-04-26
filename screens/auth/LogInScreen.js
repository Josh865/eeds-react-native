import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { Formik } from 'formik';
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
import { Appearance } from 'react-native-appearance';

import LogInScreenImage from '../../components/LogInScreenImage';

// Utils
import getLogInMethodDetails from '../../utils/getLogInMethodDetails';

// Detect which theme the user's device is using
const deviceThemeSetting = Appearance.getColorScheme();

const LogInScreen = ({ route, navigation }) => {
  const { logInMethodName, customField } = route.params;

  const logInMethod = getLogInMethodDetails(logInMethodName, customField);

  // Make sure there's a PIN associated with the crendentials the user entered
  const fetchPinStatus = async ({ value }, setSubmitting) => {
    const { data } = await axios.get(logInMethod.url + value);

    // Stop if we couldn't find a PIN matching the provided credentials
    if (data.PIN_Status === false) {
      alert(
        'Account Not Found',
        `We couldn't find an account associated with the ${logInMethod.label} you entered.`
      );

      // Let Formik know we're no longer submitting
      setSubmitting(false);

      return;
    }

    // Programmatically send user to next screen to confirm their name
    navigation.navigate('ConfirmName', {
      pin: data.PIN,
      namesArray: data.Names_Array,
      correctName: data.Correct_Name,
      logInMethodLabel: logInMethod.label,
    });

    // Let Formik know we're no longer submitting
    setSubmitting(false);
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
          leftControl={BackAction()}
        />
        <Divider />
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{ paddingBottom: 20 }}
          style={{ flex: 1 }}
        >
          <Layout
            style={{ flex: 1, alignItems: 'center', paddingHorizontal: 16 }}
          >
            <Layout style={{ marginVertical: 20 }}>
              <LogInScreenImage imageUrl={logInMethod.image} />
            </Layout>
            <Formik
              initialValues={{ value: '' }}
              validationSchema={logInMethod.validationSchema}
              onSubmit={(values, { setSubmitting }) =>
                fetchPinStatus(values, setSubmitting)
              }
            >
              {({
                values,
                handleChange,
                handleBlur,
                handleSubmit,
                errors,
                touched,
                isSubmitting,
              }) => (
                <>
                  <Input
                    name="value"
                    placeholder={`Enter Your ${logInMethod.label}`}
                    value={values.value}
                    size="large"
                    caption={errors.value && touched.value ? errors.value : ''}
                    status={errors.value && touched.value ? 'danger' : 'basic'}
                    keyboardType={logInMethod.keyboardType}
                    keyboardAppearance={
                      deviceThemeSetting === 'dark' ? 'dark' : 'default'
                    }
                    maxLength={logInMethodName === 'pin' ? 8 : 50}
                    returnKeyType="go"
                    autoFocus={true}
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={handleChange('value')}
                    onBlur={handleBlur('value')}
                  />
                  {logInMethod.instructions ? (
                    <Text
                      category="c1"
                      appearance="hint"
                      style={{
                        alignSelf: 'flex-start',
                        marginTop: errors.value && touched.value ? 6 : 0,
                        marginBottom: 12,
                      }}
                    >
                      {logInMethod.instructions}
                    </Text>
                  ) : null}
                  <Layout
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      marginTop: 6,
                    }}
                  >
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
