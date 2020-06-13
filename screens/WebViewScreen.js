import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import * as WebBrowser from 'expo-web-browser';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Divider,
  Icon,
  Layout,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';

const isAbsoluteUrl = url => {
  return url.indexOf('://') > 0 || url.indexOf('//') === 0;
};

const WebViewScreen = ({ navigation, route }) => {
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

  // Don't render anything until the URL is formatted
  if (formattedUrl === '') {
    return null;
  }

  // Native WebView doesn't work on Android 5 or lower (which corrsponds to API v21-22),
  // so for those devices, the page is opened in a modal web browser.
  if (Platform.OS === 'android' && Platform.Version < 23) {
    WebBrowser.openBrowserAsync(formattedUrl).then(result => {
      // The callback is executed when the user dismisses the browser. When they do so,
      // they get sent back to the home menu.
      navigation.goBack();
    });

    return null;
  }

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
          title={title}
          alignment="center"
          accessoryLeft={BackAction}
        />
        <Divider />
        <Layout style={{ flex: 1 }}>
          <WebView source={{ uri: formattedUrl }} />
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};

export default WebViewScreen;
