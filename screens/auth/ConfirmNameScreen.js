import React from 'react';
import { Alert, Button, Text, View } from 'react-native';

import { AuthContext } from '../../AuthContext';

const SelectLogInMethodScreen = ({ route }) => {
  const { pin } = route.params;
  const { signIn } = React.useContext(AuthContext);

  // Just for testing
  const correctName = 'Josh';

  const checkName = selectedName => {
    if (selectedName !== correctName) {
      Alert.alert('That is not the correct name.');
      return;
    }

    signIn(pin);
  };

  return (
    <View>
      <Text>Confirm Your Name</Text>
      <Button title="Josh" onPress={() => checkName('Josh')} />
      <Button title="Jennifer" onPress={() => checkName('Jennifer')} />
      <Button title="Andrew" onPress={() => checkName('Andrew')} />
    </View>
  );
};

export default SelectLogInMethodScreen;
