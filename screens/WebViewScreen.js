import React, { useEffect, useState } from 'react';
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

const isAbsoluteUrl = url => {
  return url.indexOf('://') > 0 || url.indexOf('//') === 0;
};

const WebViewScreen = ({ route, navigation }) => {
  const { url, title } = route.params;
  const [formattedUrl, setFormattedUrl] = useState('');

  // Return the provided URL as-is if it's absolute, otherwise prepend the domain
  useEffect(() => {
    if (isAbsoluteUrl(url)) {
      setFormattedUrl(url);
      return;
    }

    setFormattedUrl(`https://www.eeds.com/${url}`);
  }, [url]);

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
          {formattedUrl ? <WebView source={{ uri: formattedUrl }} /> : null}
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};

export default WebViewScreen;
