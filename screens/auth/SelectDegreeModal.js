import React from 'react';
import { Button, FlatList, Text, View } from 'react-native';

// Data
import { degrees } from '../../degrees';

const DegreeModalScreen = ({ route, navigation }) => {
  const { id, setDegree } = route.params;

  const renderItem = ({ item }) => (
    <Text
      style={{ fontSize: 16, marginBottom: 12 }}
      onPress={() => handleSelection(item)}
    >
      {item.Degree_Name}
    </Text>
  );

  const handleSelection = selectedDegree => {
    setDegree(selectedDegree);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>This is a modal!</Text>
      <FlatList
        data={degrees}
        renderItem={renderItem}
        keyExtractor={item => item.Degree_ID.toString()}
        style={{ width: '100%' }}
      />
    </View>
  );
};

export default DegreeModalScreen;
