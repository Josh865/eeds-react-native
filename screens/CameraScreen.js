import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

const CameraScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  // Immediately ask for permission to use the camera
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);

    // Make sure what they scanned goes to an eeds URL
    if (data.startsWith('https://www.eeds.com/')) {
      Alert.alert(
        'Invalid QR Code', // Title
        'The code you scanned is not a valid eeds QR code.', // Message
        [{ text: 'OK', onPress: () => setScanned(false) }], // Button
        { cancelable: false } // Don't dismiss on click outside on Android
      );
      return;
    }

    navigation.navigate('WebView', {
      url: data,
      title: 'Sign In to Event'
    });
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end'
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
            alignItems: 'center'
          }}
        >
          <View
            style={{
              width: 200,
              height: 200,
              borderWidth: 2,
              borderColor: 'rgba(255,211,0,0.7)',
              borderRadius: 10
            }}
          />
        </View>
      </BarCodeScanner>
      {scanned && (
        <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
      )}
    </View>
  );
};

export default CameraScreen;
