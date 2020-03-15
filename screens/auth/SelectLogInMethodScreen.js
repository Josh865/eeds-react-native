import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  AsyncStorage,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import axios from 'axios';
import { SafeAreaView, useSafeArea } from 'react-native-safe-area-context';
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
} from '@ui-kitten/components';

// Context
import { AuthContext } from '../../AuthContext';

// SVG images
import EedsLogo from '../../assets/eeds.svg';

// TODO: Get rid of this temp extra data. It's just to test scrolling.
const extra = [
  {
    Custom_Field_ID: 14,
    SIN: '230087',
    Custom_Field_Name: 'ACOEM Member ID',
    Login_Instructions:
      'The ACOEM Member ID is assigned to ACOEM Members and can be found by logging into http://www.acoem.org/ or by calling the ACOEM at 847-818-1800',
    Login_Logo: 'images/logos/ACOEM.png',
    Sponsor_Name: 'ACOEM',
  },
  {
    Custom_Field_ID: 17,
    SIN: '230159',
    Custom_Field_Name: 'CHNw UPN',
    Login_Instructions: 'Enter your Community Health Network Username',
    Login_Logo: 'images/logos/CHN.png',
    Sponsor_Name: 'Community Health Network',
  },
];

const SelectLogInMethodScreen = ({ navigation }) => {
  // Get the auth context so we know if the user has already created an account that's
  // awaiting approval.
  const { awaitingApproval } = useContext(AuthContext);

  // Create ref to bottom sheet so we can move it to its snap points programmatically
  const bottomSheet = useRef();

  // Fetch additional log in methods
  const [additionalLogInMethods, setAdditionalLogInMethods] = useState([]);
  useEffect(() => {
    axios(
      'https://www.eeds.com/ajax_functions.aspx?Function_ID=143'
    ).then(({ data }) => setAdditionalLogInMethods([...data, ...extra]));
  }, []);

  const goToLogInScreen = (logInMethod, customField = null) => {
    navigation.navigate('LogIn', {
      logInMethod: logInMethod,
      customField: customField,
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
          paddingVertical: 13,
          paddingHorizontal: 15,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
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
            height: 35,
          }}
          onPress={() => bottomSheet.current.snapTo(1)}
        >
          <Layout
            level="4"
            style={{
              borderRadius: 9999,
              padding: 2,
            }}
          >
            <CloseIcon width={20} height={20} fill="#8f9bb3" />
          </Layout>
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
        onPress={() => goToLogInScreen('custom', item)}
      />
    );

    return (
      <Layout>
        <List
          data={additionalLogInMethods}
          ListFooterComponent={() => <Layout />} // Create safe space below list for iOS
          ListFooterComponentStyle={{ paddingBottom: insets.bottom }}
          ItemSeparatorComponent={() => <Divider />}
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
      outputRange: [0.5, 0],
    });

    return (
      <Animated.View
        pointerEvents="none"
        style={[
          styles.shadowContainer,
          {
            opacity: animatedShadowOpacity,
          },
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
      'awaitingApproval',
    ]).then(() => alert('storage cleared'));
  };

  return (
    <Layout style={{ flex: 1 }}>
      {/* The platform specific code prevents Android users from dismissing the bottom
      sheet with a swipe, but without it the inner list cannot be scrolled and the onPress
      handler is not called. Everything works fine on iOS. */}
      <BottomSheet
        ref={bottomSheet}
        snapPoints={[400, 0]}
        initialSnap={1}
        renderContent={renderBottomSheetContent}
        renderHeader={renderBottomSheetHeader}
        enabledGestureInteraction={Platform.OS === 'ios' ? true : false}
        callbackNode={fall}
      />

      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* <Text>Awaiting Approval? {JSON.stringify(awaitingApproval)}</Text>
        <Button onPress={CLEAR_STORAGE}>Clear Storage</Button> */}
        {/* The width attribute is required, but it doesn't really do anything since the
        width is automatically constrained by the reduced height. The left margin is to
        account for the offset TM that makes it look as if the logo isn't centered. */}
        <EedsLogo
          width={'80%'}
          height={150}
          style={{ marginLeft: 25, marginBottom: 20 }}
        />

        <Button
          size="large"
          style={{ width: '90%', marginBottom: 5 }}
          onPress={() => goToLogInScreen('pin')}
        >
          Log In with PIN
        </Button>

        <Button
          size="large"
          style={{ width: '90%', marginBottom: 5 }}
          onPress={() => goToLogInScreen('email')}
        >
          Log In with Email
        </Button>

        {/* <Button
          size="large"
          style={{ width: '90%', marginVertical: 5 }}
          onPress={() => goToLogInScreen('phone')}
        >
          Log In with Phone
        </Button> */}

        <Button
          size="large"
          appearance="outline"
          style={{ width: '90%' }}
          onPress={showMoreOptions}
        >
          More Ways to Log In
        </Button>

        {/* Only have option to create account if they don't have one already awaiting
        approval. TODO: Use UI Kitten theme to set colors. */}
        {awaitingApproval ? (
          <Card
            header={() => <CardHeader title="Account Pending Approval" />}
            status="warning"
            style={{ width: '90%', marginTop: 24 }}
          >
            <Text>
              Thanks for creating an eeds account. We're reviewing your
              information to make sure you have access to all of your CE
              credits. We'll send you an email when your account is ready to
              use.
            </Text>
          </Card>
        ) : (
          <>
            <Divider
              style={{
                width: '75%',
                marginVertical: 24,
              }}
            />
            <Layout
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text category="p1">New to eeds?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('CreateAccount')}
              >
                <Text category="p1" status="primary" style={{ marginLeft: 3 }}>
                  Create an Account
                </Text>
              </TouchableOpacity>
            </Layout>
          </>
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
    paddingLeft: 16,
  },
  logo: {
    width: 219,
    height: 150,
    marginBottom: 30,
  },
  shadowContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'black',
  },
});

export default SelectLogInMethodScreen;
