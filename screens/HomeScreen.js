import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import {
  Divider,
  Icon,
  Layout,
  List,
  ListItem,
  TopNavigation,
  TopNavigationAction
} from '@ui-kitten/components';
import axios from 'axios';

import { AuthContext } from '../AuthContext';

const HomeScreen = ({ navigation }) => {
  const { pin, signOut } = useContext(AuthContext);

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

  // Sends the user to the mobile page corresponding to their selection inside a WebView
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

  const LogOutAction = () => (
    <TopNavigationAction
      icon={() => <Icon name="log-out-outline" />}
      onPress={signOut}
    />
  );

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          title="Home Menu"
          alignment="center"
          rightControls={LogOutAction()}
        />
        <Divider />
        <Layout style={styles.content}>
          <List
            data={menuItems}
            renderItem={renderListItem}
            ItemSeparatorComponent={() => <Divider />}
          />
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1
  }
});

export default HomeScreen;
