import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Keyboard, ScrollView, TouchableWithoutFeedback } from 'react-native';
import {
  Button,
  Card,
  CardHeader,
  Divider,
  Icon,
  Input,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';

const SignInToEventScreen = ({ navigation }) => {
  const [signInCode, setSignInCode] = useState('');
  const pin = '99001200';

  const doSignIn = () => {
    navigation.navigate('WebView', {
      url: `https://www.eeds.com/mobile/hp_signin.aspx?Emulate_App=yes&PIN=${pin}&Sign_in_Code=${signInCode}`,
      title: 'Sign In to an Activity',
    });
  };

  const BackAction = () => (
    <TopNavigationAction
      icon={style => <Icon {...style} name="arrow-back" />}
      onPress={() => navigation.goBack()}
    />
  );

  const TextCodeHeader = () => (
    <CardHeader
      title="Sign in with Text Code"
      onPress={e => Keyboard.dismiss()}
    />
  );

  const QrCodeHeader = () => (
    <CardHeader title="Scan QR Code" onPress={e => Keyboard.dismiss()} />
  );

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          title="Sign In to an Event"
          alignment="center"
          leftControl={BackAction()}
        />
        <Divider />
        {/* <Text category="h5" style={{ alignSelf: 'flex-start' }}>
            How would you like to sign in?
          </Text> */}

        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{
            flex: 1,
            paddingHorizontal: 16,
            paddingVertical: 20,
          }}
        >
          <TouchableWithoutFeedback
            accessible={false}
            onPress={Keyboard.dismiss}
          >
            <Layout>
              <Card header={TextCodeHeader} onPress={Keyboard.dismiss}>
                <Text>
                  Enter the activity code displayed at the event to sign in.
                </Text>
                <Input
                  value={signInCode}
                  size="large"
                  style={{ marginTop: 12 }}
                  autoCapitalize="none"
                  autoCompleteType="off"
                  autoCorrect={false}
                  onChangeText={text => setSignInCode(text)}
                />
                <Button style={{ marginTop: 12 }} onPress={doSignIn}>
                  Sign In
                </Button>
              </Card>

              <Layout style={{ height: 24 }} />

              <Card header={QrCodeHeader} onPress={Keyboard.dismiss}>
                <Text>
                  Use your device's camera to scan the QR code provided at the
                  event to sign in.
                </Text>
                <Button
                  style={{ marginTop: 12, alignItems: 'center' }}
                  onPress={() => navigation.navigate('Camera')}
                >
                  Scan QR Code
                </Button>
              </Card>
            </Layout>
          </TouchableWithoutFeedback>
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};

export default SignInToEventScreen;
