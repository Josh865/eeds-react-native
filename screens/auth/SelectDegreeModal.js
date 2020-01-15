import React from 'react';
import { Layout, List, ListItem } from '@ui-kitten/components';

const DegreeModalScreen = ({ route, navigation }) => {
  const { degrees, setFieldValue, setSelectedDegree } = route.params;

  const renderItem = ({ item }) => (
    <ListItem
      key={item.id}
      title={item.Degree_Name}
      onPress={() => handleSelection(item)}
    />
  );

  const handleSelection = selectedDegree => {
    setFieldValue('degreeId', selectedDegree.Degree_ID);
    setSelectedDegree(selectedDegree);
    navigation.goBack();
  };

  return (
    <Layout style={{ flex: 1 }}>
      <List data={degrees} renderItem={renderItem} />
    </Layout>
  );
};

export default DegreeModalScreen;
