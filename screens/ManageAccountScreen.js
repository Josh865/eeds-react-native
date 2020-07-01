import * as React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';

import { useAuth } from '../context/auth-context';

const ManageAccountScreen = ({ navigation }) => {
  const { logout } = useAuth();

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
          title="Manage My Account"
          alignment="center"
          accessoryLeft={BackAction}
        />

        <Divider />

        <Text>Hi</Text>

        <Button onPress={logout}>Log Out</Button>
      </SafeAreaView>
    </Layout>
  );
};

export default ManageAccountScreen;
