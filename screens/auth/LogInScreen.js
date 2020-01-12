import React from 'react';
import { Button, Input, Layout } from '@ui-kitten/components';

const LogInScreen = ({ route, navigation }) => {
  // Get the select log in method as a route parameter
  const { logInMethod } = route.params;

  // Set the title of the screen (displayed in the header) based on the user's selected
  // log in method
  navigation.setOptions({ title: `Log In with ${route.params.logInMethod}` });

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
    <Layout style={{ flex: 1, paddingHorizontal: 16 }}>
      <Input
        placeholder="PIN"
        value={value}
        size="large"
        style={{ marginTop: 24 }}
        onChangeText={setValue}
      />
      <Button size="large" style={{ marginTop: 6 }} onPress={fetchAccount}>
        Log In
      </Button>
    </Layout>
  );
};

export default LogInScreen;
