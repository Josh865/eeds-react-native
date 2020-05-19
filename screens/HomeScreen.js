import React, { useState, useEffect, Fragment } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import {
  Divider,
  Icon,
  Layout,
  List,
  Text,
  TopNavigation,
  TopNavigationAction,
  useTheme,
} from '@ui-kitten/components';
import axios from 'axios';
import { useColorScheme } from 'react-native-appearance';

// Context
import { useAuth } from '../context/auth-context';
import { useUser } from '../context/user-context';

// Components
import FullPageSpinner from '../components/FullPageSpinner';
import HomeMenuEventCard from '../components/HomeMenuEventCard';
import HomeMenuTouchableItem from '../components/HomeMenuTouchableItem';

// Utilities
import { timeOfDay } from '../utils/timeOfDay';
import getIconForMenuItem from '../utils/getIconForMenuItem';

// SVGs
import EedsLogoBlue from '../assets/eeds_blue.svg';
import EedsLogoWhite from '../assets/eeds_white.svg';

const HomeScreen = ({ navigation }) => {
  const theme = useTheme(); // UI Kitten Theme
  const colorScheme = useColorScheme(); // Device color scheme (light or dark)

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
          // FIXME: Until server response is changed, remove "Sign-In to Event" option
          // since there is a custom screen for that (rather than redirecting to site)
          const withoutSignIn = whatNowItems.filter(
            item => item.Button_Text !== 'Sign-In to Event'
          );

          setWhatNow(withoutSignIn);
        }

        setBusy(false);
      });
  }, [pin]);

  // Send the user to the requested page inside a browser
  const goToUrl = url => {
    WebBrowser.openBrowserAsync(`https://www.eeds.com/${url}`);
  };

  const TopNavLogo = () => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
      }}
    >
      {colorScheme === 'dark' ? (
        <EedsLogoWhite width={80} height={40} />
      ) : (
        <EedsLogoBlue width={80} height={40} />
      )}
    </View>
  );

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
          title={TopNavLogo}
          alignment="center"
          accessoryRight={LogOutAction}
        />
        <Divider />
        <ScrollView style={{ flex: 1 }}>
          <Layout level="2" style={{ flex: 1 }}>
            <Text category="h4" style={styles.greeting}>
              Good {timeOfDay}, {firstName}
            </Text>
            <Text category="c1" style={styles.pin}>
              eeds PIN: {pin}
            </Text>

            {/* Your Events */}
            {events.length > 0 && (
              <Layout level="2" style={{ padding: 16 }}>
                <Text category="h5" style={styles.sectionHeading}>
                  Your Events
                </Text>
                {events.map((item, index) => (
                  <Fragment key={item.Button_Text}>
                    <HomeMenuTouchableItem
                      text={item.Button_Text}
                      iconName="checkmark-square-2-outline"
                      onPress={() => goToUrl(item.Button_URL, item.Button_Text)}
                    />
                    {index < events.length - 1 && <Divider />}
                  </Fragment>
                ))}
              </Layout>
            )}

            {/* Items requiring a follow-up */}
            {followUps.length > 0 && (
              <Layout level="2" style={{ padding: 16 }}>
                <Text category="h5" style={styles.sectionHeading}>
                  Follow-Ups Required
                </Text>
                <Layout>
                  {followUps.map((followUp, index) => (
                    <Fragment key={followUp.Button_Text}>
                      <HomeMenuTouchableItem
                        text={followUp.Button_Text}
                        iconName="alert-circle-outline"
                        iconColor={theme['color-warning-default']}
                        onPress={() =>
                          goToUrl(followUp.Button_URL, followUp.Button_Text)
                        }
                      />
                      {index < followUps.length - 1 && <Divider />}
                    </Fragment>
                  ))}
                </Layout>
              </Layout>
            )}

            {/* What now items */}
            <Layout level="2" style={{ padding: 16 }}>
              <Text category="h5" style={styles.sectionHeading}>
                What Would You Like to Do?
              </Text>
              <Layout>
                <HomeMenuTouchableItem
                  text="Sign In to an Event"
                  iconName="log-in-outline"
                  onPress={() => navigation.navigate('SignInToEvent')}
                />
                <Divider />
                {whatNow.map((item, index) => (
                  <Fragment key={item.Button_Text}>
                    <HomeMenuTouchableItem
                      text={item.Button_Text}
                      iconName={getIconForMenuItem(item.Button_Text)}
                      onPress={() => goToUrl(item.Button_URL, item.Button_Text)}
                    />
                    {index < whatNow.length - 1 && <Divider />}
                  </Fragment>
                ))}
              </Layout>
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
  },

  pin: {
    paddingHorizontal: 16,
    marginBottom: 24,
    fontWeight: '300',
  },

  eventsContainer: {
    padding: 16,
    paddingRight: 0,
  },

  sectionHeading: {
    marginBottom: 8,
  },
});

export default HomeScreen;
