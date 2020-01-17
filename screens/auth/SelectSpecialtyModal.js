import React, { useEffect, useState } from 'react';
import { Layout, List, ListItem } from '@ui-kitten/components';

const SpecialtyModalScreen = ({ route, navigation }) => {
  const {
    specialties,
    setFieldValue,
    setFieldTouched,
    setSelectedSpecialty
  } = route.params;

  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState('');

  // Tell Formik field was touched on first render and when selected specialty changes.
  // This is necessary to handle the validation of our fake input.
  useEffect(() => {
    setFieldTouched('Specialty_ID');
  }, [selectedSpecialtyId]);

  const renderItem = ({ item }) => (
    <ListItem
      key={item.id}
      title={item.Specialty_Name}
      onPress={() => handleSelection(item)}
    />
  );

  const handleSelection = item => {
    // Update local state (will trigger effect)
    setSelectedSpecialtyId(item.Specialty_ID);

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
