import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@ui-kitten/components';

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
  useEffect(() => {
    axios(
      'https://www.eeds.com/ajax_functions.aspx?Function_ID=143'
    ).then(({ data }) => setAdditionalLogInMethods(data));
  }, []);

  const goToLogInScreen = logInMethod => {
    navigation.navigate('LogIn', { logInMethod: logInMethod });
  };

  const showMoreOptions = () => {
    bottomSheet.current.snapTo(0);
  };

  const renderBottomSheetHeader = () => (
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
      <Text style={{ flex: 1, fontSize: 20 }}>Additional Log In Options</Text>
      <Button
        style={{ fontSize: 20 }}
        onPress={() => bottomSheet.current.snapTo(1)}
      >
        Close
      </Button>
    </View>
  );

  const renderBottomSheetContent = () => {
    const renderItem = ({ item }) => (
      <Button onPress={() => goToLogInScreen(item.Custom_Field_ID)}>
        {item.Custom_Field_Name}
      </Button>
    );

    return (
      <View
        style={{
          backgroundColor: '#eee',
          height: 400,
          padding: 0
        }}
      >
        <FlatList
          data={additionalLogInMethods}
          renderItem={renderItem}
          keyExtractor={item => item.Custom_Field_ID.toString()}
          style={{ width: '100%' }}
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
        <Button style={{ width: '90%' }} onPress={() => goToLogInScreen('pin')}>
          Log In with PIN
        </Button>
        <Button
          style={{ width: '90%' }}
          onPress={() => goToLogInScreen('email')}
        >
          Log In with Email
        </Button>
        <Button
          style={{ width: '90%' }}
          onPress={() => goToLogInScreen('phone')}
        >
          Log In with Phone
        </Button>
        <Button style={{ width: '90%' }} onPress={showMoreOptions}>
          More Options
        </Button>
        {/* Only have option to create account if they don't have one already awaiting approval */}
        {awaitingApproval ? (
          <Text>The account you created is pending approval.</Text>
        ) : (
          <Button onPress={() => navigation.navigate('CreateAccount')}>
            Create Account
          </Button>
        )}
      </SafeAreaView>
    </View>
  );
};

export default SelectLogInMethodScreen;
