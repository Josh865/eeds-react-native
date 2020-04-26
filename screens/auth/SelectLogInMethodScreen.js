import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  Card,
  CardHeader,
  Divider,
  Layout,
  Text,
} from '@ui-kitten/components';

import LogInMethodBottomSheet from '../../components/LogInMethodBottomSheet';
import EedsLogo from '../../assets/eeds.svg';

import { useAuth } from '../../context/auth-context';

const SelectLogInMethodScreen = ({ navigation }) => {
  const { awaitingApproval } = useAuth();

  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [additionalLogInMethods, setAdditionalLogInMethods] = useState([]);

  // Fetch additional log in methods
  useEffect(() => {
    axios
      .get('https://www.eeds.com/ajax_functions.aspx?Function_ID=143')
      .then(({ data }) => setAdditionalLogInMethods(data));
  }, []);

  const goToLogInScreen = (logInMethod, customField = null) => {
    navigation.navigate('LogIn', {
      logInMethod: logInMethod,
      customField: customField,
    });
  };

  const showMoreOptions = () => {
    setShowBottomSheet(true);
  };

  return (
    <Layout style={{ flex: 1 }}>
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
    </Layout>
  );
};

export default SelectLogInMethodScreen;
