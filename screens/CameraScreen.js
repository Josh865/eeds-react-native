import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { useSafeArea } from 'react-native-safe-area-context';
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  useTheme,
} from '@ui-kitten/components';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { useUser } from '../context/user-context';

const CameraScreen = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeArea();

  const { pin } = useUser();

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

    // Before navigating to the WebView, remove the Camera route (this screen) from the
    // navigation stack so that when the user navigates back, they aren't taken back to
    // the camera screen.
    navigation.dispatch(state => {
      const routes = state.routes.filter(r => r.name !== 'Camera');

      return CommonActions.reset({
        ...state,
        routes,
        index: routes.length - 1,
      });
    });

    navigation.navigate('WebView', {
      url: `https://www.eeds.com/mobile/hp_signin.aspx?Emulate_App=yes&PIN=${pin}&Sign_in_Code=${signInCode}`,
      title: 'Sign In to an Event',
    });
  };

  const BackAction = () => (
    <TopNavigationAction
      icon={style => <Icon {...style} name="arrow-back" />}
      onPress={() => navigation.goBack()}
    />
  );

  const RequestingPermission = () => (
    <Layout style={styles.permissionStatusContainer}>
      <Text category="p1">Requesting camera permission...</Text>
    </Layout>
  );

  const PermissionDenied = () => (
    <Layout style={styles.permissionStatusContainer}>
      <Icon
        name="alert-circle-outline"
        width={48}
        height={48}
        fill={theme['color-warning-default']}
        style={{ marginBottom: 10 }}
      />
      <Text category="p1">
        Camera access denied. In order to scan QR codes, please allow the eeds
        app to access your device's camera.
      </Text>
    </Layout>
  );

  return (
    <Layout style={{ flex: 1, paddingTop: insets.top }}>
      <TopNavigation
        title="Scan Event Code"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      {/* Waiting for user to allow access to camera */}
      {hasPermission === null && <RequestingPermission />}

      {/* User denied access to camera */}
      {hasPermission === false && <PermissionDenied />}

      {/* User granted access to camera */}
      {hasPermission && (
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
      )}
    </Layout>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  permissionStatusContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },

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
