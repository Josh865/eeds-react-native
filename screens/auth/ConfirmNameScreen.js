import React, { useContext } from 'react';
import { Alert } from 'react-native';
import { Button, Layout, Text } from '@ui-kitten/components';

import { AuthContext } from '../../AuthContext';

const SelectLogInMethodScreen = ({ route, navigation }) => {
  const { pin, namesArray, correctName, logInMethodLabel } = route.params;
  const { signIn } = useContext(AuthContext);

  const checkName = selectedName => {
    if (selectedName !== correctName) {
      Alert.alert(
        `That isn't the name associated with the ${logInMethodLabel} you entered. Please enter your credentials again.`
      );
      navigation.goBack();
      return;
    }

    signIn(pin);
  };

  return (
    <Layout style={{ flex: 1, paddingTop: 16, paddingHorizontal: 24 }}>
      {namesArray.map(name => (
        <Button
          key={name}
          status="basic"
          style={{ marginBottom: 6 }}
          onPress={() => checkName(name)}
        >
          {name}
        </Button>
      ))}
    </Layout>
  );
};

export default SelectLogInMethodScreen;
