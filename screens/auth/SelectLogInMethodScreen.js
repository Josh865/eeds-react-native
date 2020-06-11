import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, useWindowDimensions } from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native-appearance';
import { Button, Card, Divider, Layout, Text } from '@ui-kitten/components';

import LogInMethodBottomSheet from '../../components/LogInMethodBottomSheet';

import EedsLogo from '../../assets/eeds_blue.svg';
import EedsLogoWhite from '../../assets/eeds_white.svg';

import { useAuth } from '../../context/auth-context';

const SelectLogInMethodScreen = ({ navigation }) => {
  const { awaitingApproval } = useAuth();
  const colorScheme = useColorScheme();
  const windowHeight = useWindowDimensions().height;

  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [additionalLogInMethods, setAdditionalLogInMethods] = useState([]);

  // Fetch additional log in methods
  useEffect(() => {
    axios
      .get('https://www.eeds.com/ajax_functions.aspx?Function_ID=143')
      .then(({ data }) => setAdditionalLogInMethods(data));
  }, []);

  const goToLogInScreen = (logInMethodName, customField = null) => {
    navigation.navigate('LogIn', {
      logInMethodName,
      customField,
    });
  };

  const showMoreOptions = () => {
    setShowBottomSheet(true);
  };

  return (
    <Layout style={{ flex: 1 }}>
      {/* Bottom sheet contains additional log in options, such as organization-specific
      log in methods. It's hidden until the user taps "More Ways to Log In" button. */}
      <LogInMethodBottomSheet
        showBottomSheet={showBottomSheet}
        setShowBottomSheet={setShowBottomSheet}
        additionalLogInMethods={additionalLogInMethods}
        goToLogInScreen={goToLogInScreen}
      />

      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* The width attribute is required, but it doesn't really do anything since the
        width is automatically constrained by the reduced height. The left margin is to
        account for the offset 'TM' that makes it look as if the logo isn't centered. */}
        {colorScheme === 'dark' ? (
          <EedsLogoWhite
            width={'80%'}
            height={Math.min(180, windowHeight * 0.2)}
            style={{ marginLeft: 25, marginBottom: 20 }}
          />
        ) : (
          <EedsLogo
            width={'80%'}
            height={Math.min(180, windowHeight * 0.2)}
            style={{ marginLeft: 25, marginBottom: 20 }}
          />
        )}

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

        <Button
          size="large"
          style={{ width: '90%', marginBottom: 5 }}
          onPress={() => goToLogInScreen('phone')}
        >
          Log In with Mobile Number
        </Button>

        <Button
          size="large"
          appearance="outline"
          style={{ width: '90%' }}
          onPress={showMoreOptions}
        >
          More Ways to Log In
        </Button>

        {/* Only have option to create account if they don't have one already awaiting
        approval. */}
        {awaitingApproval ? (
          <AwaitingApprovalCard />
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
    </Layout>
  );
};

const AwaitingApprovalCard = () => (
  <Card
    header={props => (
      <View {...props}>
        <Text category="h6">Account Awaiting Approval</Text>
      </View>
    )}
    status="warning"
    style={{ width: '90%', marginTop: 24 }}
  >
    <Text>
      Thanks for creating an eeds account. We're reviewing your information to
      make sure you have access to all of your CE credits. We'll send you an
      email when your account is ready to use.
    </Text>
  </Card>
);

export default SelectLogInMethodScreen;
