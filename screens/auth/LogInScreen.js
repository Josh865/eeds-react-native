import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Input, Layout } from '@ui-kitten/components';

const LogInScreen = ({ route, navigation }) => {
  // Get the select log in method passed from the select method page
  const { logInMethod: logInMethodParam, customFieldId } = route.params;

  const [customField, setCustomField] = useState(null);

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
      url: 'https://www.eeds.com/ajax_functions.aspx?Function_ID=5&PIN='
    },
    email: {
      label: 'Email',
      keyboardType: 'email-address',
      url:
        'https://www.eeds.com/ajax_functions.aspx?Function_ID=50&Email_Address='
    },
    phone: {
      label: 'Phone',
      keyboardType: 'phone-pad',
      url:
        'https://www.eeds.com/ajax_functions.aspx?Function_ID=50&Phone_Number='
    },
    custom: {
      label: customField ? customField.Custom_Field_Name : '',
      keyboardType: 'default',
      url: `https://www.eeds.com/ajax_functions.aspx?Function_ID=5&PIN=${value}&Custom_Field_ID=${
        customField ? customField.Custom_Field_ID : null
      }`
    }
  };

  const selectedLogInMethod = availableLogInMethods[logInMethodParam];

  // Set the title of the screen (displayed in the header) based on the user's selected
  // log in method
  navigation.setOptions({ title: `Log In with ${selectedLogInMethod.label}` });

  // Store the value the user enters into the input field. We'll use this stored value to
  // perform authentication.
  const [value, setValue] = React.useState('');

  // TODO: Make log in method dynamic

  const fetchAccount = () => {
    // Actually add call using value
    const pin = '99001200';

    navigation.navigate('ConfirmName', { pin: pin });
  };

  return (
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
      <Button size="large" style={{ marginTop: 6 }} onPress={fetchAccount}>
        Log In
      </Button>
    </Layout>
  );
};

export default LogInScreen;
