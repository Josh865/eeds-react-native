import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  AsyncStorage,
  Image,
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

import { AuthContext } from '../../AuthContext';

const SelectLogInMethodScreen = ({ navigation }) => {
  // Get the auth context so we know if the user has already created an account that's
  // awaiting approval.
  const { awaitingApproval } = useContext(AuthContext);

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
  const logoSource = require('../../assets/eeds_light.png');

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
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f7f9fc',
          paddingVertical: 18,
          paddingHorizontal: 15,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10
        }}
      >
        <Text category="s1" style={{ flex: 1 }}>
          Additional Log In Options
        </Text>
        <TouchableOpacity onPress={() => bottomSheet.current.snapTo(1)}>
          <View
            style={{
              borderRadius: 9999,
              backgroundColor: '#E4E9F2',
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
        <Button
          size="large"
          style={{ width: '90%', marginBottom: 12 }}
          onPress={() => goToLogInScreen('pin')}
        >
          Log In with PIN
        </Button>
        <Button
          size="large"
          style={{ width: '90%', marginBottom: 12 }}
          onPress={() => goToLogInScreen('email')}
        >
          Log In with Email
        </Button>
        <Button
          size="large"
          style={{ width: '90%', marginBottom: 12 }}
          onPress={() => goToLogInScreen('phone')}
        >
          Log In with Phone
        </Button>
        <Button
          size="large"
          appearance="outline"
          style={{ width: '90%' }}
          onPress={showMoreOptions}
        >
          More Options
        </Button>
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
          <>
            <Text style={{ marginTop: 24 }} category="s2" appearance="hint">
              New to eeds?
            </Text>
            <Button
              appearance="ghost"
              status="primary"
              style={{ marginTop: -8 }}
              onPress={() => navigation.navigate('CreateAccount')}
            >
              Create an Account
            </Button>
          </>
        )}
      </SafeAreaView>
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
    width: 219,
    height: 150,
    marginBottom: 20
  },
  shadowContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'black'
  }
});

export default SelectLogInMethodScreen;
