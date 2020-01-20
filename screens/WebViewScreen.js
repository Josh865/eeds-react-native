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

const WebViewScreen = ({ route, navigation }) => {
  const { url, title } = route.params;

  const BackAction = () => (
    <TopNavigationAction
      icon={() => <Icon name="arrow-back" />}
      onPress={() => navigation.goBack()}
    />
  );

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          title={title}
          alignment="center"
          leftControl={BackAction()}
        />
        <Divider />
        <Layout style={{ flex: 1 }}>
          <WebView source={{ uri: `https://www.eeds.com/${url}` }} />
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};

export default WebViewScreen;
