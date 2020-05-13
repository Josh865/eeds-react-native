import * as React from 'react';
import {
  Card,
  Divider,
  Icon,
  Layout,
  Text,
  useTheme,
} from '@ui-kitten/components';

const HomeMenuEventCard = ({ item, goToUrl }) => {
  const theme = useTheme();

  return (
    <Card
      style={{ width: 200, height: 200 }}
      onPress={() => goToUrl(item.Button_URL, item.Button_Text)}
    >
      <Layout style={{ width: '100%', height: '100%' }}>
        <Layout style={{ flex: 1 }}>
          <Icon
            width={32}
            height={32}
            fill={theme['color-primary-default']}
            name="calendar-outline"
          />
          <Divider style={{ marginVertical: 8 }} />
          <Text numberOfLines={5}>{item.Button_Text}</Text>
        </Layout>
        <Layout style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Icon
            width={20}
            height={20}
            fill={theme['color-primary-default']}
            name="external-link"
          />
        </Layout>
      </Layout>
    </Card>
  );
};

export default HomeMenuEventCard;
