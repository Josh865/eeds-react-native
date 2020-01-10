import React, { useEffect, useState } from 'react';
import { Button, FlatList, Text, View } from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import axios from 'axios';

import { AuthContext } from '../../AuthContext';

const SelectLogInMethodScreen = ({ navigation }) => {
  const { awaitingApproval } = React.useContext(AuthContext); // Convert to prop/param?
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
        title="X"
        style={{ fontSize: 20 }}
        onPress={() => bottomSheet.current.snapTo(1)}
      />
    </View>
  );

  const renderBottomSheetContent = () => {
    const renderItem = ({ item }) => (
      <Button
        title={item.Custom_Field_Name}
        onPress={() => goToLogInScreen(item.Custom_Field_ID)}
      />
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

      <View style={{ flex: 1 }}>
        <Text>How would you like to log in?</Text>
        <Button title="PIN" onPress={() => goToLogInScreen('pin')} />
        <Button title="Email" onPress={() => goToLogInScreen('email')} />
        <Button title="Phone" onPress={() => goToLogInScreen('phone')} />
        <Button title="Show More Options" onPress={showMoreOptions} />
        {/* Only have option to create account if they don't have one already awaiting approval */}
        {awaitingApproval ? (
          <Text>The account you created is pending approval.</Text>
        ) : (
          <Button
            title="Create Account"
            onPress={() => navigation.navigate('CreateAccount')}
          />
        )}
      </View>
    </View>
  );
};

export default SelectLogInMethodScreen;
