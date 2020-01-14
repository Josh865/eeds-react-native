import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Divider, Layout, List, ListItem } from '@ui-kitten/components';
import axios from 'axios';

import { AuthContext } from '../AuthContext';

const HomeScreen = ({ navigation }) => {
  const { pin } = useContext(AuthContext);

  const [menuItems, setMenuItems] = useState([]);

  // Fetch the menu items available to the user
  useEffect(() => {
    axios
      .get(
        `https://www.eeds.com/ajax_functions.aspx?Function_ID=138&PIN=${pin}`
      )
      .then(({ data }) => {
        setMenuItems(data.Menu_Item_Array);
      });
  }, []);

  const handlePress = index => {
    const url = menuItems[index].Button_URL;
    const title = menuItems[index].Button_Text;

    navigation.navigate('WebView', {
      url: url,
      title: title
    });
  };

  const renderListItem = ({ item }) => (
    <ListItem
      title={`${item.Button_Text}`}
      style={{ paddingTop: 16, paddingBottom: 16 }}
      onPress={handlePress}
    />
  );

  return (
    <Layout style={styles.content}>
      <List
        data={menuItems}
        renderItem={renderListItem}
        ItemSeparatorComponent={() => <Divider />}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1
  }
});

export default HomeScreen;
