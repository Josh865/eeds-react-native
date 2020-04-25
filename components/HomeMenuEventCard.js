import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Divider, Icon, Layout, Text } from '@ui-kitten/components';

const HomeMenuEventCard = ({ item, goToUrl }) => (
  <Card
    style={{ width: 200, height: 200 }}
    onPress={() => goToUrl(item.Button_URL, item.Button_Text)}
  >
    <Layout
      style={{
        ...StyleSheet.absoluteFillObject,
        height: 200,
        padding: 16,
      }}
    >
      <Icon width={32} height={32} fill="#3366ff" name="calendar-outline" />
      <Divider style={{ marginVertical: 8 }} />
      <Text>{item.Button_Text}</Text>
      <Layout
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16,
        }}
      >
        <Icon width={20} height={20} fill="#3366ff" name="external-link" />
      </Layout>
    </Layout>
  </Card>
);

export default HomeMenuEventCard;
