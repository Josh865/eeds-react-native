import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Layout, Text } from '@ui-kitten/components';

const AccountCreatedScreen = () => {
  return (
    <SafeAreaView>
      <Layout>
        <Text>
          Your account was created. We'll send you an email once your new
          account is ready to use.
        </Text>
      </Layout>
    </SafeAreaView>
  );
};

export default AccountCreatedScreen;
