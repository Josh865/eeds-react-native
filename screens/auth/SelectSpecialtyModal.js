import React, { useEffect, useState } from 'react';
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
