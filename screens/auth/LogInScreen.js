import React from 'react';
import { Button, Text, TextInput, View } from 'react-native';

const LogInScreen = ({ route, navigation }) => {
  const { logInMethod } = route.params;

  const [value, setValue] = React.useState('');

  // TODO: Make log in method dynamic

  const fetchAccount = () => {
    // Actually add call using value
    const pin = '99001200';

    navigation.navigate('ConfirmName', { pin: pin });
  };

  return (
    <View>
      <Text>Selected Log In Method: {logInMethod}</Text>
      <TextInput placeholder="PIN" value={value} onChangeText={setValue} />
      <Button title="Log In" onPress={fetchAccount} />
    </View>
  );
};

export default LogInScreen;
