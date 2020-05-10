import React, { useState } from 'react';
import { Keyboard, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import {
  Button,
  Card,
  Divider,
  Icon,
  Input,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';

import { useUser } from '../context/user-context';

const SignInToEventScreen = ({ navigation }) => {
  const { pin } = useUser();

  const [signInCode, setSignInCode] = useState('');

  const signInToActivity = async () => {
    await WebBrowser.openBrowserAsync(
      `https://www.eeds.com/mobile/hp_signin.aspx?Emulate_App=yes&PIN=${pin}&Sign_in_Code=${signInCode}`
    );

    // Since the Home Menu screen is at the top of the navigation, calling this method
    // causee the app to return the user to home menu after the browser is dismissed,
    // bypassing the sign in screen.
    navigation.popToTop();
  };

  const BackAction = () => (
    <TopNavigationAction
      icon={style => <Icon {...style} name="arrow-back" />}
      onPress={() => navigation.goBack()}
    />
  );

  const TextCodeHeader = props => (
    <View {...props}>
      <Text category="h6">Sign In with Text Code</Text>
    </View>
  );

  const QrCodeHeader = props => (
    <View {...props}>
      <Text category="h6">Scan QR Code</Text>
    </View>
  );

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          title="Sign In to an Event"
          alignment="center"
          accessoryLeft={BackAction}
        />

        <Divider />

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flex: 1,
            paddingHorizontal: 16,
            paddingVertical: 20,
          }}
        >
          <Layout style={{ flex: 1 }}>
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
              <Button style={{ marginTop: 12 }} onPress={signInToActivity}>
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
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};

export default SignInToEventScreen;
