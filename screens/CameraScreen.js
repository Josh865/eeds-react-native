import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
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

const CameraScreen = ({ navigation }) => {
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

  const goBack = () => {
    navigation.goBack();
  };

  const handleBarCodeScanned = ({ type, data }) => {
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
            onPress: goBack,
            style: 'cancel',
          },
          { text: 'Try Again', onPress: () => setScanned(false) },
        ],
        { cancelable: false } // Don't dismiss on click outside on Android
      );
      return;
    }

    navigation.navigate('WebView', {
      // url: `${data}&PIN=${pin}`, TODO: Make this work
      url: data,
      title: 'Sign In to Event',
    });
  };

  const BackAction = () => (
    <TopNavigationAction
      icon={() => <Icon name="arrow-back" />}
      onPress={goBack}
    />
  );

  if (hasPermission === null) {
    return <Text>Requesting camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
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
          <View
            style={{
              ...StyleSheet.absoluteFill,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 200,
                height: 200,
                borderWidth: 2,
                borderColor: 'rgba(255,211,0,0.7)',
                borderRadius: 10,
              }}
            />
          </View>
        </BarCodeScanner>
      </View>
    </Layout>
  );
};

export default CameraScreen;
