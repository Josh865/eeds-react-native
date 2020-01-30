import React from 'react';
import { Image } from 'react-native';
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
  TopNavigationAction
} from '@ui-kitten/components';
import { Appearance } from 'react-native-appearance';
import * as Yup from 'yup';

// SVG images
import Doctors from '../../assets/doctors.svg';

// Detect which theme the user's device is using
const deviceThemeSetting = Appearance.getColorScheme();

const LogInScreen = ({ route, navigation }) => {
  // Get the select log in method passed from the select method page
  const { logInMethod: logInMethodParam, customField } = route.params;

  const availableLogInMethods = {
    pin: {
      label: 'PIN',
      image: null,
      instructions: null,
      keyboardType: 'numeric',
      url: `https://www.eeds.com/ajax_functions.aspx?Function_ID=5&PIN=`,
      validationSchema: Yup.object({
        value: Yup.string()
          .trim()
          .required('Required')
          .length(8, 'Your PIN must be exactly eight numbers')
      })
    },
    email: {
      label: 'Email',
      image: null,
      instructions: null,
      keyboardType: 'email-address',
      url: `https://www.eeds.com/ajax_functions.aspx?Function_ID=50&Email_Address=`,
      validationSchema: Yup.object({
        value: Yup.string()
          .trim()
          .required('Required')
          .email('Please enter a valid email address')
      })
    },
    phone: {
      label: 'Phone',
      image: null,
      instructions: null,
      keyboardType: 'phone-pad',
      url: `https://www.eeds.com/ajax_functions.aspx?Function_ID=50&Phone_Number=`,
      validationSchema: Yup.object({
        value: Yup.string()
          .trim()
          .required()
      })
    },
    custom: {
      label: customField?.Custom_Field_Name,
      image: `https://www.eeds.com/${customField?.Login_Logo}`,
      instructions: customField?.Login_Instructions,
      keyboardType: 'default',
      url: `https://www.eeds.com/ajax_functions.aspx?Function_ID=5&Custom_Field_ID=${customField?.Custom_Field_ID}&PIN=`,
      validationSchema: Yup.object({
        value: Yup.string()
          .trim()
          .required('Required')
      })
    }
  };

  const selectedLogInMethod = availableLogInMethods[logInMethodParam];

  // Make sure there's a PIN associated with the crendentials the user entered
  const fetchPinStatus = async ({ value }, setSubmitting) => {
    // Hit server to ensure there's an account associated with the provided credentials
    const { data } = await axios.get(selectedLogInMethod.url + value);

    // Stop if we couldn't find a PIN matching the provided credentials
    if (data.PIN_Status === false) {
      Alert.alert(
        `We couldn't find an account associated with the ${selectedLogInMethod.label} you entered.`
      );
      setSubmitting(false); // Let Formik know we're no longer submitting
      return;
    }

    // Programmatically send user to next screen to confirm their name
    navigation.navigate('ConfirmName', {
      pin: data.PIN,
      namesArray: data.Names_Array,
      correctName: data.Correct_Name,
      logInMethodLabel: selectedLogInMethod.label
    });

    setSubmitting(false); // Let Formik know we're no longer submitting
  };

  const HeaderImage = imageProps => {
    // If no custom image associated with the selected log in method, use generic image
    if (selectedLogInMethod.image === null) {
      return <Doctors width={300} height={200} {...imageProps} />;
    }

    // If the user isn't in dark mode, we can return the image as-is
    if (deviceThemeSetting !== 'dark') {
      return (
        <Image
          source={{ uri: selectedLogInMethod.image }}
          style={{ width: 300, height: 200 }}
          resizeMode={'contain'}
          {...imageProps}
        />
      );
    }

    // TODO: If the user is in dark mode, we make the white's black and then desaturate
    return (
      <Image
        source={{ uri: selectedLogInMethod.image }}
        style={{
          width: 300,
          height: 200,
          tintColor: 'transparent'
        }}
        resizeMode={'contain'}
        {...imageProps}
      />
    );
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
          title={`Log In with ${selectedLogInMethod.label}`}
          alignment="center"
          leftControl={BackAction()}
        />
        <Divider />
        <Layout
          style={{ flex: 1, alignItems: 'center', paddingHorizontal: 16 }}
        >
          <Layout style={{ marginVertical: 20 }}>
            <HeaderImage />
          </Layout>
          <Formik
            initialValues={{ value: '' }}
            validationSchema={selectedLogInMethod.validationSchema}
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
              isSubmitting
            }) => (
              <>
                <Input
                  name="value"
                  placeholder={`Enter Your ${selectedLogInMethod.label}`}
                  value={values.value}
                  size="large"
                  caption={errors.value && touched.value ? errors.value : ''}
                  status={errors.value && touched.value ? 'danger' : 'basic'}
                  keyboardType={selectedLogInMethod.keyboardType}
                  keyboardAppearance={
                    deviceThemeSetting === 'dark' ? 'dark' : 'default'
                  }
                  maxLength={logInMethodParam === 'pin' ? 8 : 50}
                  returnKeyType="go"
                  autoFocus={true}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={handleChange('value')}
                  onBlur={handleBlur('value')}
                />
                {selectedLogInMethod.instructions ? (
                  <Text
                    category="c1"
                    appearance="hint"
                    style={{
                      alignSelf: 'flex-start',
                      marginTop: errors.value && touched.value ? 6 : 0,
                      marginBottom: 12
                    }}
                  >
                    {selectedLogInMethod.instructions}
                  </Text>
                ) : null}
                <Layout
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 6
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
      </SafeAreaView>
    </Layout>
  );
};

export default LogInScreen;
