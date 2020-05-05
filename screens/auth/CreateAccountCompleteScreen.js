import React from 'react';
import { InteractionManager } from 'react-native';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import {
  Button,
  Divider,
  Layout,
  Text,
  TopNavigation,
} from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';

import SignUp from '../../assets/signup.svg';

const CreateAccountCompleteScreen = ({ navigation }) => {
  // Update navigation state so it doesn't include the create account route
  const removeCreateAccountRoute = React.useCallback(() => {
    navigation.dispatch(state => {
      const routes = state.routes.filter(
        route => route.name !== 'CreateAccount'
      );

      return CommonActions.reset({
        ...state,
        routes,
        index: routes.length - 1,
      });
    });
  }, [navigation]);

  // Once the transition to the page is complete, remove the create account route from the
  // navigation stack to prevent the user from returning to it.
  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        removeCreateAccountRoute();
      });

      return () => task.cancel();
    }, [removeCreateAccountRoute])
  );

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation title="Account Created" alignment="center" />
        <Divider />
        <Layout style={{ flex: 1, paddingHorizontal: 16 }}>
          <Layout style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <SignUp width={200} height={200} />
          </Layout>
          <Text category="h3">Thanks for signing up!</Text>
          <Text category="p1" style={{ marginTop: 15 }}>
            We're reviewing your information to make sure you have access to all
            of your CE credits. We'll send you an email when your account is
            ready to use.
          </Text>
          <Button
            appearance="ghost"
            style={{ marginTop: 12 }}
            onPress={() => navigation.navigate('SelectLogInMethod')}
          >
            Return Home
          </Button>
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};

export default CreateAccountCompleteScreen;
