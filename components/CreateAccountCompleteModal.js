import React from 'react';
import { Modal } from 'react-native';
import { Button, Layout, Text } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';

import SignUp from '../assets/signup.svg';

const CreateAccountCompleteModal = ({ isVisible, close }) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={close}
    >
      <Layout style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <Layout style={{ flex: 1, paddingHorizontal: 16 }}>
            <Layout style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <SignUp width={200} height={200} />
            </Layout>
            <Text category="h3">Thanks for signing up!</Text>
            <Text category="p1" style={{ marginTop: 15 }}>
              We're reviewing your information to make sure you have access to
              all of your CE credits. We'll send you an email when your account
              is ready to use.
            </Text>
            <Button
              appearance="ghost"
              style={{ marginTop: 12 }}
              onPress={close}
            >
              Return Home
            </Button>
          </Layout>
        </SafeAreaView>
      </Layout>
    </Modal>
  );
};

export default CreateAccountCompleteModal;
