import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import {
  Divider,
  Icon,
  Layout,
  TopNavigation,
  TopNavigationAction
} from '@ui-kitten/components';

const BackIcon = style => <Icon {...style} name="arrow-back" />;

const WebViewScreen = ({ route, navigation }) => {
  // Get the param and provide a default value
  const { url, title } = route.params;

  navigation.setOptions({ title });

  return (
    <Layout style={{ flex: 1 }}>
      <WebView source={{ uri: `https://www.eeds.com/${url}` }} />
    </Layout>
  );
};

export default WebViewScreen;
