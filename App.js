import * as React from 'react';
import { AsyncStorage, Text, View } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';

// Context
import { AuthContextProvider } from './AuthContext';

// Navigators
import AuthNavigator from './navigation/AuthNavigator';
import AppNavigator from './navigation/AppNavigator';

const SplashScreen = () => (
  <View>
    <Text>Loading...</Text>
  </View>
);

export default function App({ navigation }) {
  const reducer = (prevState, action) => {
    switch (action.type) {
      case 'RESTORE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false
        };
      case 'SIGN_IN':
        return {
          ...prevState,
          userToken: action.token
        };
      case 'SIGN_OUT':
        return {
          ...prevState,
          userToken: null
        };
    }
  };

  const [state, dispatch] = React.useReducer(reducer, {
    isLoading: true,
    userToken: null
  });

  // As soon as the user opens the app, try to get their credentials from storage
  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    // Uncomment to mimic loading delay
    // setTimeout(() => bootstrapAsync(), 4000);
    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      }
    }),
    []
  );

  return (
    <AuthContextProvider value={authContext}>
      <NavigationNativeContainer>
        {state.isLoading ? (
          // We haven't finished checking for the token yet
          <SplashScreen />
        ) : state.userToken == null ? (
          // No token found, user isn't signed in
          <AuthNavigator />
        ) : (
          // User is signed in
          <AppNavigator />
        )}
      </NavigationNativeContainer>
    </AuthContextProvider>
  );
}
