import React from 'react';
import { AsyncStorage } from 'react-native';

import createAccount from '../utils/createAccount';

const AuthContext = React.createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'restore': {
      return { ...state, pin: action.pin, busy: false };
    }
    case 'login': {
      return { ...state, pin: action.pin };
    }
    case 'logout': {
      return { ...state, pin: null };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(authReducer, {
    busy: true,
    pin: null,
    login: async pin => {
      await AsyncStorage.setItem('pin', String(pin));
      dispatch({ type: 'login', pin: pin });
    },
    logout: async () => {
      await AsyncStorage.removeItem('pin');
      dispatch({ type: 'logout' });
    },
    signUp: async userInput => {
      await createAccount(userInput);

      await AsyncStorage.multiSet([
        ['lastName', String(userInput.Last_Name)],
        ['email', String(userInput.Email)],
        ['awaitingApproval', 'true'],
      ]);

      return Promise.resolve();
    },
  });

  // As soon as the app is mounted, try to get the user's PIN either from device storage
  // or by looking to see if they have a recently approved account.
  React.useEffect(() => {
    AsyncStorage.getItem('pin').then(storedPin => {
      dispatch({ type: 'restore', pin: storedPin });
    });
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

// Custom hook
const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export { AuthProvider, useAuth };
