import React from 'react';
import { Layout, List, ListItem } from '@ui-kitten/components';

const DegreeModalScreen = ({ route, navigation }) => {
  const {
    degrees,
    setFieldValue,
    setSelectedDegree,
    setSelectedSpecialty
  } = route.params;

  const renderItem = ({ item }) => (
    <ListItem
      key={item.id}
      title={item.Degree_Name}
      onPress={() => handleSelection(item)}
    />
  );

  const handleSelection = item => {
    // Update Formik value
    setFieldValue('Degree_ID', item.Degree_ID);

    // Since the degree changed, we need to reset the specialty values since any
    // previously selected specialty may not be compatible with the newly selected degree.
    // This probably isn't the best place to do this, but it's hard to see where else we
    // could without having to write a bunch of code.
    setFieldValue('Specialty_ID', '');
    setSelectedSpecialty({ Specialty_ID: '', Specialty_Name: '' });

    // Update create account component state
    setSelectedDegree(item);

    // Close the modal
    navigation.goBack();
  };

  return (
    <Layout style={{ flex: 1 }}>
      <List data={degrees} renderItem={renderItem} />
    </Layout>
  );
};

export default DegreeModalScreen;
