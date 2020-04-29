import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useSafeArea } from 'react-native-safe-area-context';
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { useUser } from '../context/user-context';

const CameraScreen = ({ navigation }) => {
  const { pin } = useUser();
  const insets = useSafeArea();

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  // Immediately ask for permission to use the camera
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);

    // Make sure what they scanned goes to an eeds URL
    const isValid = data.startsWith('https://www.eeds.com/');

    if (!isValid) {
      Alert.alert(
        'Invalid QR Code', // Title
        'The code you scanned is not a valid eeds QR code.', // Message
        [
          {
            text: 'Cancel',
            onPress: () => navigation.goBack(),
            style: 'cancel',
          },
          {
            text: 'Try Again',
            onPress: () => setScanned(false),
          },
        ],
        { cancelable: false } // Don't dismiss on click outside on Android
      );
      return;
    }

    // The URL embedded in the QR code is intended to allow users to sign in to an event
    // before entering their PIN. However, since we have the PIN, we can use the "normal"
    // HP sign in page that includes the learner's PIN. For that reason, this just gets
    // the sign in code from the QR URL (assumes sign in code is always last parameter).
    const signInCode = data.split('=').pop();

    await WebBrowser.openBrowserAsync(
      `https://www.eeds.com/mobile/hp_signin.aspx?Emulate_App=yes&PIN=${pin}&Sign_in_Code=${signInCode}`
    );

    // Since the Home Menu screen is at the top of the navigation, calling this method
    // causee the app to return the user to home menu after the browser is dismissed,
    // bypassing the camera screen they were on when they scanned the QR code.
    navigation.popToTop();
  };

  const BackAction = () => (
    <TopNavigationAction
      icon={() => <Icon name="arrow-back" />}
      onPress={() => navigation.goBack()}
    />
  );

  // Waiting for user to allow access to camera
  if (hasPermission === null) {
    return (
      <Layout
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text category="p1">Requesting camera permission...</Text>
      </Layout>
    );
  }

  // App was denied access to camera
  if (hasPermission === false) {
    return (
      <Layout
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
      >
        <Text category="p1">
          Camera access denied. In order to scan QR codes, please allow the eeds
          app to access your device's camera.
        </Text>
      </Layout>
    );
  }

  return (
    <Layout style={{ flex: 1, paddingTop: insets.top }}>
      <TopNavigation
        title="Scan Event Code"
        alignment="center"
        leftControl={BackAction()}
      />
      <Divider />
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        >
          <View style={styles.yellowSqaureContainer}>
            <View style={styles.yellowSqaure} />
          </View>
        </BarCodeScanner>
      </View>
    </Layout>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  yellowSqaureContainer: {
    ...StyleSheet.absoluteFill,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  yellowSqaure: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: 'rgba(255,211,0,0.7)',
    borderRadius: 10,
  },
});
