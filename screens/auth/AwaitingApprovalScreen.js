import React from 'react';
import { Button, Text, View } from 'react-native';

import { AuthContext } from '../../AuthContext';

const AwaitingApprovalScreen = ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext);

  const handlePress = () => {
    // Go to website
  };

  return (
    <View>
      <Text>
        Thanks for signing up for an account. We'll send you an email once your
        account is ready to use. In the meantime, learn more about us.
      </Text>

      <Button title="Learn More" onPress={handlePress} />
    </View>
  );
};

export default AwaitingApprovalScreen;
