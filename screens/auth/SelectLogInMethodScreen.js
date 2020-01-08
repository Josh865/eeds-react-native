import React from 'react';
import { Button, Text, View } from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';

import { AuthContext } from '../../AuthContext';

const SelectLogInMethodScreen = ({ navigation }) => {
  const { awaitingApproval } = React.useContext(AuthContext); // Convert to prop/param?
  const bottomSheet = React.useRef();

  const goToLogInScreen = logInMethod => {
    navigation.navigate('LogIn', { logInMethod: logInMethod });
  };

  const showMoreOptions = () => {
    console.log('showing');
    bottomSheet.current.snapTo(0);
  };

  const hideMoreOptions = () => {
    console.log('hiding');
    bottomSheet.current.snapTo(2);
  };

  const renderContent = () => (
    <View style={{ backgroundColor: 'red', height: 400, padding: 20 }}>
      <Text>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Est vitae,
        dignissimos, distinctio temporibus fuga saepe quibusdam eius quod
        impedit molestias inventore tempore. Esse dolor vitae quidem incidunt ex
        accusamus dicta. Lorem ipsum dolor sit, amet consectetur adipisicing
        elit. Est vitae, dignissimos, distinctio temporibus fuga saepe quibusdam
        eius quod impedit molestias inventore tempore. Esse dolor vitae quidem
        incidunt ex accusamus dicta. Lorem ipsum dolor sit, amet consectetur
        adipisicing elit. Est vitae, dignissimos, distinctio temporibus fuga
        saepe quibusdam eius quod impedit molestias inventore tempore. Esse
        dolor vitae quidem incidunt ex accusamus dicta. Lorem ipsum dolor sit,
        amet consectetur adipisicing elit. Est vitae, dignissimos, distinctio
        temporibus fuga saepe quibusdam eius quod impedit molestias inventore
        tempore. Esse dolor vitae quidem incidunt ex accusamus dicta. Lorem
        ipsum dolor sit, amet consectetur adipisicing elit. Est vitae,
        dignissimos, distinctio temporibus fuga saepe quibusdam eius quod
        impedit molestias inventore tempore. Esse dolor vitae quidem incidunt ex
        accusamus dicta.
      </Text>
    </View>
  );

  const renderHeader = () => (
    // Can put handle here
    <View style={{ backgroundColor: 'blue' }}>
      <Text>I'm the header</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <BottomSheet
        ref={bottomSheet}
        snapPoints={[400, 100, 0]}
        initialSnap={2}
        renderContent={renderContent}
        renderHeader={renderHeader}
      />

      <View style={{ flex: 1, backgroundColor: 'pink' }}>
        <Text>How would you like to log in?</Text>
        <Button title="PIN" onPress={() => goToLogInScreen('pin')} />
        <Button title="Email" onPress={() => goToLogInScreen('email')} />
        <Button title="Phone" onPress={() => goToLogInScreen('phone')} />
        <Button title="Show More Options" onPress={showMoreOptions} />
        <Button title="Hide More Options" onPress={hideMoreOptions} />
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
