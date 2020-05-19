import * as React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Icon, Layout, Text, useTheme } from '@ui-kitten/components';
import { useColorScheme } from 'react-native-appearance';

import EedsLogo from '../assets/eeds_blue.svg';
import EedsLogoWhite from '../assets/eeds_white.svg';

const ConnectionNotice = () => {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const windowHeight = useWindowDimensions().height;

  return (
    <Layout
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {colorScheme === 'dark' ? (
        <EedsLogoWhite
          width={'80%'}
          height={Math.min(180, windowHeight * 0.2)}
          style={{ marginLeft: 25, marginBottom: 20 }}
        />
      ) : (
        <EedsLogo
          width={'80%'}
          height={Math.min(180, windowHeight * 0.2)}
          style={{ marginLeft: 25, marginBottom: 20 }}
        />
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 40,
        }}
      >
        <Icon
          name="alert-circle-outline"
          width={60}
          height={60}
          fill={theme['color-danger-default']}
          style={{ marginRight: 5 }}
        />

        <View>
          <Text category="h6" status="danger" style={{ marginBottom: 5 }}>
            No Connection
          </Text>

          <Text category="p1">
            An Internet connection is required to use the eeds mobile app.
          </Text>
        </View>
      </View>
    </Layout>
  );
};

export default ConnectionNotice;
