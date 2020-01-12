import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import axios from 'axios';
import { SafeAreaView, useSafeArea } from 'react-native-safe-area-context';
import { Button, Icon, List, ListItem, Text } from '@ui-kitten/components';

import { AuthContext } from '../../AuthContext';

const SelectLogInMethodScreen = ({ navigation }) => {
  // Don't show the header on this screen
  navigation.setOptions({
    headerShown: false
  });

  // Get the auth context so we know if the user has already created an account that's
  // awaiting approval. TODO: Convert to prop/param?
  const { awaitingApproval } = React.useContext(AuthContext);

  // Create ref to bottom sheet so we can move it to its snap points programmatically
  const bottomSheet = React.useRef();

  // Fetch additional log in methods
  const [additionalLogInMethods, setAdditionalLogInMethods] = useState([]);
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

  const goToLogInScreen = logInMethod => {
    navigation.navigate('LogIn', { logInMethod: logInMethod });
  };

  const showMoreOptions = () => {
    bottomSheet.current.snapTo(0);
  };

  const renderBottomSheetHeader = () => {
    const CloseIcon = style => <Icon name="close-circle" {...style} />;

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'between',
          alignItems: 'center',
          backgroundColor: '#eee',
          paddingLeft: 15,
          paddingRight: 15,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10
        }}
      >
        <Text category="s1" style={{ flex: 1 }}>
          Additional Log In Options
        </Text>
        <Button
          appearance="ghost"
          status="basic"
          icon={CloseIcon}
          onPress={() => bottomSheet.current.snapTo(1)}
        />
      </View>
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
        titleStyle={{}}
        onPress={() => goToLogInScreen(item.Custom_Field_ID)}
      />
    );

    return (
      <View style={{ paddingBottom: insets.bottom }}>
        <List
          data={additionalLogInMethods}
          ItemSeparatorComponent={() => (
            <View
              style={{ height: 1, width: '100%', backgroundColor: 'lightgray' }}
            />
          )}
          renderItem={renderItem}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <BottomSheet
        ref={bottomSheet}
        snapPoints={['40%', 0]}
        initialSnap={1}
        renderContent={renderBottomSheetContent}
        renderHeader={renderBottomSheetHeader}
      />

      {/* Use SafeAreaView here since we aren't rendering a header on this page */}
      <SafeAreaView
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
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
        {/* Only have option to create account if they don't have one already awaiting approval */}
        {awaitingApproval ? (
          <Text>The account you created is pending approval.</Text>
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
    </View>
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
  }
});

export default SelectLogInMethodScreen;
