import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import {
  Button,
  Divider,
  Icon,
  Layout,
  List,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import axios from 'axios';

import { useAuth } from '../context/auth-context';
import { useUser } from '../context/user-context';

import FullPageSpinner from '../components/FullPageSpinner';
import HomeMenuEventCard from '../components/HomeMenuEventCard';

import { timeOfDay } from '../utils/timeOfDay';

const HomeScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const { pin, firstName } = useUser();

  const [busy, setBusy] = useState(true);
  const [events, setEvents] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [whatNow, setWhatNow] = useState([]);

  // Fetch the menu items available to the user
  useEffect(() => {
    if (!pin) {
      return;
    }

    axios
      .get(
        `https://www.eeds.com/ajax_functions.aspx?Function_ID=149&PIN=${pin}`
      )
      .then(({ data }) => {
        const eventItems = data.Section_Array.find(
          section => section.Section_Name === 'Your Events'
        )?.Button_Array;

        const followUpItems = data.Section_Array.find(
          section => section.Section_Name === 'Follow-up Required'
        )?.Button_Array;

        const whatNowItems = data.Section_Array.find(
          section => section.Section_Name === 'What would you like to do now?'
        ).Button_Array;

        // Array.find() method returns undefined if no matches are found, so to preserve
        // the empty arrays that these values were initialized with, the values are only
        // replaced if matches were found (we don't want to set their value to undefined).
        if (eventItems) {
          setEvents(eventItems);
        }

        if (followUpItems) {
          setFollowUps(followUpItems);
        }

        if (whatNowItems) {
          setWhatNow(whatNowItems);
        }

        setBusy(false);
      });
  }, [pin]);

  // Send the user to the requested page inside a browser
  const goToUrl = url => {
    WebBrowser.openBrowserAsync(`https://www.eeds.com/${url}`);
  };

  // Function to render a "Log Out" icon as the header's right control
  const LogOutAction = () => (
    <TopNavigationAction
      icon={style => <Icon {...style} name="log-out-outline" />}
      onPress={() => logout()}
    />
  );

  if (busy) {
    return <FullPageSpinner />;
  }

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
          <Layout style={{ flex: 1 }}>
            <Text category="h3" style={styles.greeting}>
              Good {timeOfDay}, {firstName}
            </Text>
            <Text category="c1" style={styles.pin}>
              eeds PIN: {pin}
            </Text>

            {/* Your Events */}
            {events.length > 0 && (
              <Layout level="2" style={styles.eventsContainer}>
                <Text
                  category="h5"
                  style={{ marginBottom: 8, fontWeight: 'normal' }}
                >
                  Your Events
                </Text>
                <List
                  data={events}
                  horizontal={true}
                  renderItem={({ item }) => (
                    <HomeMenuEventCard item={item} goToUrl={goToUrl} />
                  )}
                  ItemSeparatorComponent={() => (
                    <Layout style={{ marginHorizontal: 3 }} />
                  )}
                />
              </Layout>
            )}

            {/* Items requiring a follow-up */}
            {followUps.length > 0 && (
              <Layout
                level="2"
                style={{
                  padding: 16,
                  marginBottom: 24,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 7,
                  }}
                >
                  <Icon
                    name="alert-triangle-outline"
                    width={24}
                    height={24}
                    fill="#FF3D71"
                    style={{
                      marginRight: 5,
                    }}
                  />
                  <Text status="danger" style={{ fontWeight: '500' }}>
                    The following items need your attention
                  </Text>
                </View>
                {followUps.map(followUp => (
                  <Button
                    key={followUp.Button_Text}
                    appearance="ghost"
                    textStyle={{ fontWeight: '400' }}
                    style={{ justifyContent: 'start' }}
                    onPress={() =>
                      goToUrl(followUp.Button_URL, followUp.Button_Text)
                    }
                  >
                    {followUp.Button_Text}
                  </Button>
                ))}
              </Layout>
            )}

            {/* Action Items */}
            <Layout style={{ paddingHorizontal: 16 }}>
              <Text
                category="h5"
                style={{ marginBottom: 8, fontWeight: 'normal' }}
              >
                What would you like to do?
              </Text>
              <Button
                size="large"
                status="basic"
                textStyle={{ fontWeight: '400' }}
                style={{ marginBottom: 6, justifyContent: 'flex-start' }}
                onPress={() => navigation.navigate('SignInToEvent')}
              >
                Sign In to an Event
              </Button>
              {whatNow.map(item => (
                <Button
                  key={item.Button_Text}
                  size="large"
                  status="basic"
                  textStyle={{ fontWeight: '400' }}
                  style={{ marginVertical: 6, justifyContent: 'flex-start' }}
                  onPress={() => goToUrl(item.Button_URL, item.Button_Text)}
                >
                  {item.Button_Text}
                </Button>
              ))}
            </Layout>
          </Layout>
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  greeting: {
    paddingHorizontal: 16,
    marginTop: 24,
    fontWeight: '300',
  },

  pin: {
    paddingHorizontal: 16,
    marginBottom: 24,
    fontWeight: '300',
  },

  eventsContainer: {
    marginBottom: 24,
    padding: 16,
    paddingRight: 0,
  },
});

export default HomeScreen;
