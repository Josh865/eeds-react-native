import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
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

  // Sends the user to the mobile page corresponding to their selection inside a WebView
  const goToUrl = (url, title) => {
    navigation.navigate('WebView', {
      url: url,
      title: title,
    });
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
            <Text
              category="h3"
              style={{
                paddingHorizontal: 16,
                marginTop: 24,
                fontWeight: '300',
              }}
            >
              Good {timeOfDay}, {firstName}
            </Text>
            <Text
              category="c1"
              style={{
                paddingHorizontal: 16,
                marginBottom: 24,
                fontWeight: '300',
              }}
            >
              eeds PIN: {pin}
            </Text>

            {/* Your Events */}
            {events.length > 0 && (
              <Layout
                level="2"
                style={{
                  marginBottom: 24,
                  padding: 16,
                  paddingRight: 0,
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
              <Text
                category="h5"
                style={{ marginBottom: 8, fontWeight: 'normal' }}
              >
                What would you like to do?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Camera')}>
                <Layout level="3" style={styles.whatNowButton}>
                  <Text category="h6" style={{ fontWeight: '400' }}>
                    Scan Activity QR Code
                  </Text>
                </Layout>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignInToEvent')}
              >
                <Layout level="3" style={styles.whatNowButton}>
                  <Text category="h6" style={{ fontWeight: '400' }}>
                    Go to Sign In Screen
                  </Text>
                </Layout>
              </TouchableOpacity>
              {whatNow.map(item => (
                <TouchableOpacity
                  key={item.Button_Text}
                  onPress={() => goToUrl(item.Button_URL, item.Button_Text)}
                >
                  <Layout level="3" style={styles.whatNowButton}>
                    <Text category="h6" style={{ fontWeight: '400' }}>
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
  whatNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: 10,
    padding: 16,
    marginVertical: 6,
  },
});

export default HomeScreen;
