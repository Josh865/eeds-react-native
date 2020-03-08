import React from 'react';
import {
  Divider,
  Icon,
  Layout,
  List,
  ListItem,
  TopNavigation,
  TopNavigationAction
} from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';

const DegreeModalScreen = ({ route, navigation }) => {
  const { degrees } = route.params;

  const renderItem = ({ item }) => (
    <ListItem
      key={item.id}
      title={item.Degree_Name}
      onPress={() => handleSelection(item)}
    />
  );

  const handleSelection = item => {
    navigation.navigate('CreateAccount', { degree: item });
  };

  const CloseAction = () => (
    <TopNavigationAction
      icon={style => <Icon {...style} name="close-outline" />}
      onPress={() => navigation.goBack()}
    />
  );

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          title="Select Your Degree"
          alignment="center"
          rightControls={CloseAction()}
        />
        <Divider />
        <Layout style={{ flex: 1 }}>
          <List data={degrees} renderItem={renderItem} />
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};

export default DegreeModalScreen;
