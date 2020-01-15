import React from 'react';
import { Layout, List, ListItem } from '@ui-kitten/components';

const SpecialtyModalScreen = ({ route, navigation }) => {
  const { specialties, userInfo, setUserInfo } = route.params;

  const renderItem = ({ item }) => (
    <ListItem
      key={item.id}
      title={item.Specialty_Name}
      onPress={() => handleSelection(item)}
    />
  );

  const handleSelection = selectedSpecialty => {
    setUserInfo({ ...userInfo, specialty: selectedSpecialty });
    navigation.goBack();
  };

  return (
    <Layout style={{ flex: 1 }}>
      <List data={specialties} renderItem={renderItem} />
    </Layout>
  );
};

export default SpecialtyModalScreen;
