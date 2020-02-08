import React, { useContext } from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  Divider,
  Icon,
  Layout,
  TopNavigation,
  TopNavigationAction
} from '@ui-kitten/components';

import { AuthContext } from '../../AuthContext';

const SelectLogInMethodScreen = ({ route, navigation }) => {
  const { pin, namesArray, correctName, logInMethodLabel } = route.params;
  const { signIn } = useContext(AuthContext);

  const checkName = selectedName => {
    if (selectedName !== correctName) {
      Alert.alert(
        'Incorrect Name',
        `That isn't the name associated with the ${logInMethodLabel} you entered. Please enter your credentials again.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }],
        { cancelable: false }
      );

      return;
    }

    signIn(pin);
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
          title="Confirm Your Name"
          alignment="center"
          leftControl={BackAction()}
        />
        <Divider />
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
      </SafeAreaView>
    </Layout>
  );
};

export default SelectLogInMethodScreen;
