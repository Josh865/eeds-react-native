import * as React from 'react';
import { StyleSheet, View } from 'react-native';
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
import { useUser } from '../context/user-context';

const ManageAccountScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const { pin, fullName } = useUser();

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

        <Layout level="3" style={{ flex: 1, paddingHorizontal: 16 }}>
          <Layout level="1" style={{ marginTop: 24, borderRadius: 5 }}>
            <View style={styles.infoLine}>
              <Text>Name</Text>
              <View>
                <Text>{fullName}</Text>
              </View>
            </View>
            <Divider />
            <View style={styles.infoLine}>
              <Text>PIN</Text>
              <Text>{pin}</Text>
            </View>
          </Layout>

          <Button style={{ marginTop: 16 }} onPress={logout}>
            Log Out
          </Button>
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  infoLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
});

export default ManageAccountScreen;
