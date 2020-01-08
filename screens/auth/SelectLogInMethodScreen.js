import React from 'react';
import { Button, Text, View } from 'react-native';

import { AuthContext } from '../../AuthContext';

const SelectLogInMethodScreen = ({ navigation }) => {
  const { awaitingApproval } = React.useContext(AuthContext);

  React.useEffect(() => console.log(awaitingApproval));

  const goToLogInScreen = logInMethod => {
    navigation.navigate('LogIn', { logInMethod: logInMethod });
  };

  return (
    <View>
      <Text>How would you like to log in?</Text>
      <Button title="PIN" onPress={() => goToLogInScreen('pin')} />
      <Button title="Email" onPress={() => goToLogInScreen('email')} />
      <Button title="Phone" onPress={() => goToLogInScreen('phone')} />
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
  );
};

export default SelectLogInMethodScreen;
