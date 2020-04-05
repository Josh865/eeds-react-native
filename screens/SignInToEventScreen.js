import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Button,
  Card,
  CardHeader,
  Divider,
  Icon,
  Input,
  Layout,
  List,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';

const CameraIcon = style => <Icon {...style} name="camera-outline" />;

const SignInToEventScreen = ({ navigation }) => {
  const [signInCode, setSignInCode] = React.useState('');
  const pin = '99001200';

  const doSignIn = () => {
    navigation.navigate('WebView', {
      url: `https://www.eeds.com/mobile/hp_signin.aspx?Emulate_App=yes&PIN=${pin}&Sign_in_Code=${signInCode}`,
      title: 'Sign In to an Activity',
    });
  };

  const goToUrl = (url, title) => {
    console.log('going to url');
    navigation.navigate('WebView', {
      url: url,
      title: title,
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

  const handlePress = () => {
    Keyboard.dismiss();
  };

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          title="Sign In to an Event"
          alignment="center"
          leftControl={BackAction()}
        />
        <Divider />
        <Layout
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 16,
          }}
        >
          {/* <Text category="h5" style={{ alignSelf: 'flex-start' }}>
            How would you like to sign in?
          </Text> */}

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.select({ android: undefined, ios: 'padding' })}
          >
            <TouchableWithoutFeedback
              accessible={false}
              onPress={Keyboard.dismiss}
            >
              <Layout
                style={{
                  flex: 1,
                  paddingTop: 50,
                }}
              >
                <Card header={TextCodeHeader} onPress={Keyboard.dismiss}>
                  <Text>
                    Enter the activity code displayed at the event to sign in.
                  </Text>
                  <Input
                    value={signInCode}
                    size="large"
                    style={{ marginTop: 12 }}
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
          </KeyboardAvoidingView>
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};

export default SignInToEventScreen;
