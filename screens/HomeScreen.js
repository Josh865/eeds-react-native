import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet } from 'react-native';
import {
  Card,
  Divider,
  Icon,
  Layout,
  List,
  ListItem,
  Text,
  TopNavigation,
  TopNavigationAction
} from '@ui-kitten/components';
import axios from 'axios';

import { AuthContext } from '../AuthContext';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
  const goToUrl = (url, title) => {
    navigation.navigate('WebView', {
      url: url,
      title: title
    });
  };

  const LogOutAction = () => (
    <TopNavigationAction
      icon={style => <Icon {...style} name="log-out-outline" />}
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
        <ScrollView style={{ flex: 1 }}>
          <Layout style={styles.content}>
            <Text
              category="h3"
              style={{ textAlign: 'center', marginVertical: 24 }}
            >
              Good Morning, Josh
            </Text>

            <Layout
              style={{
                marginBottom: 24,
                padding: 16,
                backgroundColor: '#eee'
              }}
            >
              <Card>
                <Text>
                  The Maldives, officially the Republic of Maldives, is a small
                  country in South Asia, located in the Arabian Sea of the
                  Indian Ocean. It lies southwest of Sri Lanka and India, about
                  1,000 kilometres (620 mi) from the Asian continent
                </Text>
              </Card>
            </Layout>

            <Layout style={{ paddingHorizontal: 16 }}>
              {menuItems.map(item => (
                <TouchableOpacity
                  onPress={() => goToUrl(item.Button_URL, item.Button_Text)}
                >
                  <Layout
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                      backgroundColor: '#eee',
                      borderRadius: 10,
                      padding: 16,
                      marginVertical: 5
                    }}
                  >
                    <Icon
                      width={32}
                      height={32}
                      fill="#3366FF"
                      name="edit-outline"
                    />
                    <Text
                      category="h6"
                      style={{ marginLeft: 5, fontWeight: '400' }}
                    >
                      {item.Button_Text}
                    </Text>
                  </Layout>
                </TouchableOpacity>
              ))}
            </Layout>
          </Layout>
        </ScrollView>
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
