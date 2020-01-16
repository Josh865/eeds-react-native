import React from 'react';
import { Layout, List, ListItem } from '@ui-kitten/components';

const SpecialtyModalScreen = ({ route, navigation }) => {
  const { specialties, setFieldValue, setSelectedSpecialty } = route.params;

  const renderItem = ({ item }) => (
    <ListItem
      key={item.id}
      title={item.Specialty_Name}
      onPress={() => handleSelection(item)}
    />
  );

  const handleSelection = item => {
    // Update Formik value
    setFieldValue('Specialty_ID', item.Specialty_ID);

    // Update create account component state
    setSelectedSpecialty(item);

    // Close the modal
    navigation.goBack();
  };

  return (
    <Layout style={{ flex: 1 }}>
      <List data={specialties} renderItem={renderItem} />
    </Layout>
  );
};

export default SpecialtyModalScreen;
