import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import {
  Button,
  Divider,
  Icon,
  Input,
  Layout,
  Spinner,
  TopNavigation,
  TopNavigationAction
} from '@ui-kitten/components';

const LogInScreen = ({ route, navigation }) => {
  // Get the select log in method passed from the select method page
  const { logInMethod: logInMethodParam, customFieldId } = route.params;

  // Set up reactive component state
  const [customField, setCustomField] = useState(null);
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);

  // If a custom field ID was passed, get its info
  // TODO: Pass as param?
  if (customFieldId !== null) {
    useEffect(() => {
      axios('https://www.eeds.com/ajax_functions.aspx?Function_ID=143').then(
        ({ data }) => {
          setCustomField(
            data.find(
              customField => customField.Custom_Field_ID == customFieldId
            )
          );
        }
      );
    }, []);
  }

  const availableLogInMethods = {
    pin: {
      label: 'PIN',
      keyboardType: 'numeric',
      url: `https://www.eeds.com/ajax_functions.aspx?Function_ID=5&PIN=${value.trim()}`
    },
    email: {
      label: 'Email',
      keyboardType: 'email-address',
      url: `https://www.eeds.com/ajax_functions.aspx?Function_ID=50&Email_Address=${value.trim()}`
    },
    phone: {
      label: 'Phone',
      keyboardType: 'phone-pad',
      url: `https://www.eeds.com/ajax_functions.aspx?Function_ID=50&Phone_Number=${value.trim()}`
    },
    custom: {
      label: customField ? customField.Custom_Field_Name : '',
      keyboardType: 'default',
      url: `https://www.eeds.com/ajax_functions.aspx?Function_ID=5&PIN=${value.trim()}&Custom_Field_ID=${
        customField ? customField.Custom_Field_ID : null
      }`
    }
  };

  const selectedLogInMethod = availableLogInMethods[logInMethodParam];

  // Set the title of the screen (displayed in the header) based on the user's selected
  // log in method
  // navigation.setOptions({ title: `Log In with ${selectedLogInMethod.label}` });

  // Make sure there's a PIN associated with the crendentials the user entered
  const fetchPinStatus = async () => {
    const trimmedValue = value.trim();

    // TODO: Move these to dedicated validation function or switch to Formik
    if (trimmedValue.length === 0) {
      Alert.alert(`Please enter your ${selectedLogInMethod.label}.`);
      return;
    }
    if (selectedLogInMethod.label === 'PIN' && trimmedValue.length !== 8) {
      Alert.alert('Your PIN must be exactly eight numbers.');
      return;
    }

    setBusy(true);

    // Hit server to ensure there's an account associated with the provided credentials
    const { data } = await axios.get(selectedLogInMethod.url);

    // Stop if we couldn't find a PIN matching the provided credentials
    if (data.PIN_Status === false) {
      Alert.alert(
        `We couldn't find an account associated with the ${selectedLogInMethod.label} you entered.`
      );
      setBusy(false);
      return;
    }

    // Programmatically send user to next screen to confirm their name
    navigation.navigate('ConfirmName', {
      pin: data.PIN,
      namesArray: data.Names_Array,
      correctName: data.Correct_Name,
      logInMethodLabel: selectedLogInMethod.label
    });

    // TODO: This is kind of janky since it causes the button to reappear before the
    // screen transition finishes
    setBusy(false);
  };

  const BackAction = () => (
    <TopNavigationAction
      icon={() => <Icon name="arrow-back" />}
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
        <Layout style={{ flex: 1, paddingTop: 16, paddingHorizontal: 16 }}>
          <Input
            placeholder={`Enter Your ${selectedLogInMethod.label}`}
            value={value}
            size="large"
            keyboardType={selectedLogInMethod.keyboardType}
            autoFocus={true}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={setValue}
          />
          <Layout
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 6
            }}
          >
            {busy ? (
              <Spinner size="large" />
            ) : (
              <Button size="large" onPress={fetchPinStatus}>
                Log In
              </Button>
            )}
          </Layout>
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};

export default LogInScreen;
