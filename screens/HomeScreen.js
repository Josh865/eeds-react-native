import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  Button,
  Card,
  CardHeader,
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

import Book from '../assets/book.svg';
import Warning from '../assets/warning.svg';

const fakeEvents = [
  {
    Button_Section: 'Your Events',
    Button_Text:
      '11th Expert Strategies in Endoscopy Gastrointestinal and Liver Disorders',
    Button_URL:
      'mobile/hp_symposium.aspx?ConferenceID=623333&amp;Emulate_App=yes&amp;PIN=10185412'
  },
  {
    Button_Section: 'Your Events',
    Button_Text: 'Dealing with Hypertension',
    Button_URL:
      'mobile/hp_symposium.aspx?ConferenceID=623333&amp;Emulate_App=yes&amp;PIN=10185412'
  },
  {
    Button_Section: 'Your Events',
    Button_Text: 'Gastroenteritis in the Elderly',
    Button_URL:
      'mobile/hp_symposium.aspx?ConferenceID=623333&amp;Emulate_App=yes&amp;PIN=10185412'
  },
  {
    Button_Section: 'Your Events',
    Button_Text: 'New Trends in Pediatrics',
    Button_URL:
      'mobile/hp_symposium.aspx?ConferenceID=623333&amp;Emulate_App=yes&amp;PIN=10185412'
  }
];

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

  const renderEventItem = ({ item }) => (
    <Card
      style={{ width: 200, height: 200 }}
      onPress={() => goToUrl(item.Button_URL)}
    >
      <Layout
        style={{
          ...StyleSheet.absoluteFillObject,
          height: 200,
          padding: 16
        }}
      >
        <Icon width={32} height={32} fill="#3366ff" name="calendar-outline" />
        <Divider style={{ marginVertical: 8 }} />
        <Text>{item.Button_Text}</Text>
        <Layout
          style={{
            position: 'absolute',
            right: 16,
            bottom: 16
          }}
        >
          <Icon width={20} height={20} fill="#3366ff" name="external-link" />
        </Layout>
      </Layout>
    </Card>
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
              style={{
                paddingHorizontal: 16,
                marginTop: 24,
                fontWeight: '300'
              }}
            >
              Good Morning, Josh
            </Text>
            <Text
              category="c1"
              style={{
                paddingHorizontal: 16,
                marginBottom: 24,
                fontWeight: '300'
              }}
            >
              eeds PIN: 99001200
            </Text>

            {/* Your Events */}
            <Layout
              level="2"
              style={{
                marginBottom: 24,
                padding: 16,
                paddingRight: 0
              }}
            >
              <Text
                category="h5"
                style={{ marginBottom: 8, fontWeight: 'normal' }}
              >
                Your Events
              </Text>
              <List
                data={fakeEvents}
                horizontal={true}
                renderItem={renderEventItem}
                ItemSeparatorComponent={() => (
                  <Layout style={{ marginHorizontal: 3 }} />
                )}
              />
            </Layout>

            <Layout
              level="2"
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                marginBottom: 24
              }}
            >
              <View style={{ marginRight: 7 }}>
                <Warning width={32} height={32} fill="#FF3D71" />
              </View>
              <View>
                <Text status="danger" style={{ fontWeight: '500' }}>
                  You have activities with incomplete evaluations
                </Text>
                <Text category="c1" status="primary">
                  Tap here to complete your required evaluations
                </Text>
              </View>
            </Layout>

            {/* Action Items */}
            <Layout style={{ paddingHorizontal: 16 }}>
              <Button onPress={() => navigation.navigate('Camera')}>
                Camera
              </Button>
              {menuItems.map(item => (
                <TouchableOpacity
                  key={item.Button_Text}
                  onPress={() => goToUrl(item.Button_URL, item.Button_Text)}
                >
                  <Layout
                    level="3"
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                      borderRadius: 10,
                      padding: 16,
                      marginVertical: 5
                    }}
                  >
                    <Book width={24} height={24} fill="#3366ff" />
                    <Text
                      category="h6"
                      style={{ marginLeft: 7, fontWeight: '400' }}
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
