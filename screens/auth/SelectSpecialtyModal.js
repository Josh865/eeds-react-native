import React from 'react';
import {
  Divider,
  Icon,
  Layout,
  List,
  ListItem,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';

const SpecialtyModalScreen = ({ route, navigation }) => {
  const { specialties } = route.params;

  const renderItem = ({ item }) => (
    <ListItem
      key={item.id}
      title={item.Specialty_Name}
      onPress={() => handleSelection(item)}
    />
  );

  const handleSelection = item => {
    navigation.navigate('CreateAccount', { specialty: item });
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
          title="Select Your Specialty"
          alignment="center"
          rightControls={CloseAction()}
        />
        <Divider />
        <Layout style={{ flex: 1 }}>
          <List data={specialties} renderItem={renderItem} />
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};

export default SpecialtyModalScreen;
