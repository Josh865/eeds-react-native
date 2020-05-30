import React, { useEffect, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import {
  Button,
  Divider,
  Icon,
  Input,
  Layout,
  Spinner,
  Text,
  TopNavigation,
  TopNavigationAction,
  useTheme,
} from '@ui-kitten/components';

import { useUser } from '../context/user-context';

const SignInToEventScreen = ({ navigation }) => {
  const theme = useTheme();
  const { pin } = useUser();

  const [isBusy, setIsBusy] = useState(false);
  const [signInCode, setSignInCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Clear error message when text is changed to prevent stale messages
  useEffect(() => {
    setErrorMessage('');
  }, [signInCode]);

  const validateSignInCode = async () => {
    if (signInCode.length !== 6) {
      return {
        isValid: false,
        errorMessage: 'The sign-in code should be exactly six characters.',
      };
    }

    const codeStatus = await axios
      .get(
        `https://www.eeds.com/ajax_functions.aspx?Function_ID=133&Sign_In_Code=${signInCode}`
      )
      .then(({ data }) => data);

    return {
      isValid: codeStatus.Is_Valid,
      errorMessage:
        codeStatus.Error_Message_Stripped_HTML ||
        'The sign-in code you entered is not valid.',
    };
  };

  const signInToActivity = async () => {
    setIsBusy(true);

    const codeStatus = await validateSignInCode();

    setIsBusy(false);

    if (!codeStatus.isValid) {
      setErrorMessage(codeStatus.errorMessage);
      return;
    }

    navigation.navigate('WebView', {
      url: `https://www.eeds.com/mobile/hp_signin.aspx?Emulate_App=yes&PIN=${pin}&Sign_in_Code=${signInCode}`,
      title: 'Sign In to an Event',
    });
  };

  const handleQrButtonPress = () => {
    Keyboard.dismiss();

    navigation.navigate('Camera');
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
          title="Sign In to an Event"
          alignment="center"
          accessoryLeft={BackAction}
        />

        <Divider />

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContentContainer}
        >
          <Layout style={{ flex: 1 }}>
            <View
              style={{
                ...styles.card,
                borderColor: theme['border-basic-color-3'],
              }}
            >
              <Text category="h6" style={styles.cardHeader}>
                Sign In with Text Code
              </Text>
              <Divider />
              <View style={styles.cardBody}>
                <Text style={{ fontSize: 16 }}>
                  Enter the sign-in code displayed at the event to sign in.
                </Text>
                <Input
                  value={signInCode}
                  size="large"
                  style={{ marginTop: 12 }}
                  autoCapitalize="none"
                  autoCompleteType="off"
                  autoCorrect={false}
                  maxLength={6}
                  caption={errorMessage}
                  status={errorMessage ? 'danger' : 'basic'}
                  onChangeText={text => setSignInCode(text)}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 43, // Prevent jank when switching btwn button and spinner
                    marginTop: 12,
                  }}
                >
                  {isBusy ? (
                    <Spinner size="large" />
                  ) : (
                    <Button style={{ flex: 1 }} onPress={signInToActivity}>
                      Sign In
                    </Button>
                  )}
                </View>
              </View>
            </View>

            <View
              style={{
                ...styles.card,
                marginTop: 20,
                borderColor: theme['border-basic-color-3'],
              }}
            >
              <Text category="h6" style={styles.cardHeader}>
                Scan QR Code
              </Text>
              <Divider />
              <View style={styles.cardBody}>
                <Text style={{ fontSize: 16 }}>
                  Use your device's camera to scan the QR code provided at the
                  event to sign in.
                </Text>
                <Button
                  style={{ marginTop: 20, alignItems: 'center' }}
                  onPress={handleQrButtonPress}
                >
                  Scan QR Code
                </Button>
              </View>
            </View>
          </Layout>
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};

export default SignInToEventScreen;

const styles = StyleSheet.create({
  scrollContentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  card: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },

  cardHeader: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },

  cardBody: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
});
