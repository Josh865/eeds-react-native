import React, { useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import {
  Button,
  Divider,
  Icon,
  Input,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  useTheme,
} from '@ui-kitten/components';

import { useUser } from '../context/user-context';

const SignInToEventScreen = ({ navigation }) => {
  const theme = useTheme();
  const { pin } = useUser();

  const [signInCode, setSignInCode] = useState('');

  const signInToActivity = async () => {
    await WebBrowser.openBrowserAsync(
      `https://www.eeds.com/mobile/hp_signin.aspx?Emulate_App=yes&PIN=${pin}&Sign_in_Code=${signInCode}`
    );

    // Since the Home Menu screen is at the top of the navigation, calling this method
    // causes the app to return the user to home menu after the browser is dismissed,
    // bypassing the sign in screen.
    navigation.popToTop();
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
              style={{ ...styles.card, borderColor: theme['color-basic-400'] }}
            >
              <Text category="h6" style={styles.cardHeader}>
                Sign In with Text Code
              </Text>
              <Divider />
              <View style={styles.cardBody}>
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
              </View>
            </View>

            <View
              style={{
                ...styles.card,
                marginTop: 20,
                borderColor: theme['color-basic-400'],
              }}
            >
              <Text category="h6" style={styles.cardHeader}>
                Scan QR Code
              </Text>
              <Divider />
              <View style={styles.cardBody}>
                <Text>
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
