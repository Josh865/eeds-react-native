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

const currentHour = new Date().getHours();

let timeOfDay;
if (currentHour < 12) {
  timeOfDay = 'Morning';
} else if (currentHour > 12 && currentHour < 17) {
  timeOfDay = 'Afternoon';
} else {
  timeOfDay = 'Evening';
}

const HomeScreen = ({ navigation }) => {
  const { pin, signOut } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [whatNow, setWhatNow] = useState([]);

  // Fetch the menu items available to the user
  useEffect(() => {
    axios
      .get(
        `https://www.eeds.com/ajax_functions.aspx?Function_ID=149&PIN=${pin}`
      )
      .then(({ data }) => {
        setEvents(
          data.Section_Array.find(
            section => section.Section_Name === 'Your Events'
          ).Button_Array
        );

        setFollowUps(
          data.Section_Array.find(
            section => section.Section_Name === 'Follow-up Required'
          ).Button_Array
        );

        setWhatNow(
          data.Section_Array.find(
            section => section.Section_Name === 'What would you like to do now?'
          ).Button_Array
        );
      });
  }, []);

  // Sends the user to the mobile page corresponding to their selection inside a WebView
  const goToUrl = (url, title) => {
    navigation.navigate('WebView', {
      url: url,
      title: title
    });
  };

  // Function to render a "Log Out" icon as the header's right control
  const LogOutAction = () => (
    <TopNavigationAction
      icon={style => <Icon {...style} name="log-out-outline" />}
      onPress={signOut}
    />
  );

  // Function to render each item in the list of the user's events
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
              Good {timeOfDay}, Josh
            </Text>
            <Text
              category="c1"
              style={{
                paddingHorizontal: 16,
                marginBottom: 24,
                fontWeight: '300'
              }}
            >
              eeds PIN: {pin}
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
                data={events}
                horizontal={true}
                renderItem={renderEventItem}
                ItemSeparatorComponent={() => (
                  <Layout style={{ marginHorizontal: 3 }} />
                )}
              />
            </Layout>

            {/* Items requiring a follow-up */}
            {followUps && (
              <Layout
                level="2"
                style={{
                  padding: 16,
                  marginBottom: 24
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 7
                  }}
                >
                  <Warning
                    width={24}
                    height={24}
                    fill="#FF3D71"
                    style={{
                      marginRight: 5
                    }}
                  />
                  <Text status="danger" style={{ fontWeight: '500' }}>
                    The following items need your attention
                  </Text>
                </View>
                {followUps.map(followUp => (
                  <TouchableOpacity
                    key={followUp.Button_Text}
                    onPress={() =>
                      goToUrl(followUp.Button_URL, followUp.Button_Text)
                    }
                  >
                    <Text status="primary">{followUp.Button_Text}</Text>
                  </TouchableOpacity>
                ))}
              </Layout>
            )}

            {/* Action Items */}
            <Layout style={{ paddingHorizontal: 16 }}>
              <Button onPress={() => navigation.navigate('Camera')}>
                Camera
              </Button>
              {whatNow.map(item => (
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
