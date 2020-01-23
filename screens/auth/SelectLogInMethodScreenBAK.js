import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  AsyncStorage,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import axios from 'axios';
import { SafeAreaView, useSafeArea } from 'react-native-safe-area-context';
import {
  Button,
  Icon,
  Layout,
  List,
  ListItem,
  Text
} from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import { Appearance } from 'react-native-appearance';
import Doctors from '../../assets/doctors.svg';

import { AuthContext } from '../../AuthContext';

const SelectLogInMethodScreen = ({ navigation }) => {
  // Get the auth context so we know if the user has already created an account that's
  // awaiting approval.
  const { awaitingApproval } = useContext(AuthContext);

  // Detect which theme the user's device is using
  const deviceThemeSetting = Appearance.getColorScheme();

  // Create ref to bottom sheet so we can move it to its snap points programmatically
  const bottomSheet = useRef();

  // Fetch additional log in methods
  const [additionalLogInMethods, setAdditionalLogInMethods] = useState([]);
  // TODO: Get rid of this temp extra data. It's just to test scrolling.
  const extra = [
    {
      Custom_Field_ID: 14,
      SIN: '230087',
      Custom_Field_Name: 'ACOEM Member ID',
      Login_Instructions:
        'The ACOEM Member ID is assigned to ACOEM Members and can be found by logging into http://www.acoem.org/ or by calling the ACOEM at 847-818-1800',
      Login_Logo: 'images/logos/ACOEM.png',
      Sponsor_Name: 'ACOEM'
    },
    {
      Custom_Field_ID: 17,
      SIN: '230159',
      Custom_Field_Name: 'CHNw UPN',
      Login_Instructions: 'Enter your Community Health Network Username',
      Login_Logo: 'images/logos/CHN.png',
      Sponsor_Name: 'Community Health Network'
    }
  ];
  useEffect(() => {
    axios(
      'https://www.eeds.com/ajax_functions.aspx?Function_ID=143'
    ).then(({ data }) => setAdditionalLogInMethods([...data, ...extra]));
  }, []);

  // TODO: Load correct image based on theme
  const logoSource = require('../../assets/eeds_dark.png');

  const goToLogInScreen = (logInMethod, customFieldId = null) => {
    navigation.navigate('LogIn', {
      logInMethod: logInMethod,
      customFieldId: customFieldId
    });
  };

  const showMoreOptions = () => {
    bottomSheet.current.snapTo(0);
  };

  const renderBottomSheetHeader = () => {
    const CloseIcon = style => <Icon {...style} name="close" />;

    return (
      <Layout
        level="3"
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          // backgroundColor:
          //   deviceThemeSetting === 'dark' ? '#101426' : '#f7f9fc',
          paddingVertical: 13,
          paddingHorizontal: 15,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10
        }}
      >
        <Text category="s1" style={{ flex: 1 }}>
          More Ways to Log In
        </Text>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: 35,
            height: 35
          }}
          onPress={() => bottomSheet.current.snapTo(1)}
        >
          <View
            style={{
              borderRadius: 9999,
              backgroundColor:
                deviceThemeSetting === 'dark' ? '#2e3a59' : '#e4e9f2',
              padding: 2
            }}
          >
            <CloseIcon width={20} height={20} fill="#8f9bb3" />
          </View>
        </TouchableOpacity>
      </Layout>
    );
  };

  // We need this hook to set the bottom padding in the bottom sheet so that the last item
  // can still be selected.
  const insets = useSafeArea();

  const renderBottomSheetContent = () => {
    const renderItem = ({ item }) => (
      <ListItem
        title={item.Custom_Field_Name}
        description={item.Sponsor_Name}
        onPress={() => goToLogInScreen('custom', item.Custom_Field_ID)}
      />
    );

    return (
      <Layout>
        <List
          data={additionalLogInMethods}
          ListFooterComponent={() => <Layout />} // Create safe space below list for iOS
          ListFooterComponentStyle={{ paddingBottom: insets.bottom }}
          ItemSeparatorComponent={() => (
            <Layout
              style={{ height: 1, width: '100%', backgroundColor: 'lightgray' }}
            />
          )}
          renderItem={renderItem}
        />
      </Layout>
    );
  };

  // This is used by the bottom sheet to handle the transition of shadow that darkens the
  // background when the bottom sheet opens (and lighten it when bottom sheet is closed)
  const [fall] = useState(new Animated.Value(1));

  // This component is rendered when the bottom sheet opens to darken the content behind
  // the sheet.
  const renderShadow = () => {
    const animatedShadowOpacity = Animated.interpolate(fall, {
      inputRange: [0, 1],
      outputRange: [0.5, 0]
    });

    return (
      <Animated.View
        pointerEvents="none"
        style={[
          styles.shadowContainer,
          {
            opacity: animatedShadowOpacity
          }
        ]}
      />
    );
  };

  // FIXME: For dev use only
  const CLEAR_STORAGE = async () => {
    await AsyncStorage.multiRemove([
      'pin',
      'lastName',
      'email',
      'awaitingApproval'
    ]).then(() => alert('storage cleared'));
  };

  return (
    <Layout style={{ flex: 1 }}>
      {/* <LinearGradient
        colors={[
          'rgba(28, 121, 228, 1)',
          'rgba(77, 144, 222, 1)',
          'rgba(77, 144, 222, 1)',
          'rgba(28, 121, 228, 1)'
        ]}
        start={[0, 0]}
        end={[1, 1]}
        locations={[0, 0.4, 0.6, 1]}
        style={{ ...StyleSheet.absoluteFill }}
      /> */}

      {/* <View style={{ ...StyleSheet.absoluteFill }}>
        <ImageBackground
          source={require('../../assets/splash_blue.jpg')}
          style={{ width: '100%', height: '100%' }}
        >
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)'
            }}
          />
        </ImageBackground>
      </View> */}

      <BottomSheet
        ref={bottomSheet}
        snapPoints={[400, 0]}
        initialSnap={1}
        renderContent={renderBottomSheetContent}
        renderHeader={renderBottomSheetHeader}
        callbackNode={fall}
      />

      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* <Text>Awaiting Approval? {JSON.stringify(awaitingApproval)}</Text>
        <Button onPress={CLEAR_STORAGE}>Clear Storage</Button> */}
        <Image source={logoSource} style={styles.logo} />

        <Text>CE Simplified</Text>

        {/* <Doctors height={200} style={{ marginVertical: 20 }} /> */}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => goToLogInScreen('pin')}
        >
          {/* <Text category="s1" style={{ color: '#2b6cb0' }}> */}
          <Text category="s1" style={{ color: '#fff' }}>
            Log In with PIN
          </Text>
        </TouchableOpacity>
        {/* <Button
          size="large"
          style={{ width: '90%', marginBottom: 12 }}
          onPress={() => goToLogInScreen('pin')}
        >
          Log In with PIN
        </Button> */}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => goToLogInScreen('email')}
        >
          <Text category="s1" style={{ color: '#fff' }}>
            Log In with Email
          </Text>
        </TouchableOpacity>
        {/* <Button
          size="large"
          style={{ width: '90%', marginBottom: 12 }}
          onPress={() => goToLogInScreen('email')}
        >
          Log In with Email
        </Button> */}

        {/* <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => goToLogInScreen('phone')}
        >
          <Text category="s1" style={{ color: '#2b6cb0' }}>
            Log In with Phone Number
          </Text>
        </TouchableOpacity>
        <Button
          size="large"
          style={{ width: '90%', marginBottom: 12 }}
          onPress={() => goToLogInScreen('phone')}
        >
          Log In with Phone
        </Button> */}

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={showMoreOptions}
        >
          <Text category="s1" style={{ color: '#fff' }}>
            More Ways to Log In
          </Text>
        </TouchableOpacity>
        {/* <Button
          size="large"
          appearance="outline"
          style={{ width: '90%' }}
          onPress={showMoreOptions}
        >
          More Options
        </Button> */}
        {/* Only have option to create account if they don't have one already awaiting
        approval. TODO: Use UI Kitten theme to set colors. */}
        {awaitingApproval ? (
          <Layout
            style={{
              width: '90%',
              padding: 12,
              marginTop: 12,
              backgroundColor: 'lightyellow'
            }}
          >
            <Text>
              The account you created is pending approval. We'll send you an
              email when it's ready to use.
            </Text>
          </Layout>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 24
            }}
          >
            <Text style={{ color: 'white' }} category="p1">
              New to eeds?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('CreateAccount')}
            >
              <Text
                category="s1"
                style={{
                  color: '#fff',
                  textDecorationLine: 'underline',
                  marginLeft: 2
                }}
              >
                Create an Account
              </Text>
            </TouchableOpacity>
            {/* <Button
              appearance="ghost"
              status="primary"
              style={{ marginTop: -8 }}
              onPress={() => navigation.navigate('CreateAccount')}
            >
              Create an Account
            </Button> */}
          </View>
        )}
      </SafeAreaView>

      {/* This is the backdrop that renders over the main content when the bottom sheet
      is open. */}
      {renderShadow()}
    </Layout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 16,
    paddingLeft: 16
  },
  logo: {
    // width: 219,
    width: 146,
    // height: 150,
    height: 100,
    marginBottom: 20
  },
  shadowContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'black'
  },
  primaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    paddingVertical: 15,
    marginVertical: 3,
    // backgroundColor: 'rgba(255,255,255,0.9)',
    backgroundColor: '#1c79e4',
    borderRadius: 20
  },
  secondaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    paddingVertical: 15,
    marginVertical: 3,
    backgroundColor: 'transparent',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)'
  }
});

export default SelectLogInMethodScreen;