import React from 'react';
import { AsyncStorage } from 'react-native';

import createAccount from '../utils/createAccount';
import tryToRestorePin from '../utils/tryToRestorePin';

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
    case 'setAwaitingApproval': {
      return {
        ...state,
        awaitingApproval: action.isAwaitingApproval,
      };
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
    awaitingApproval: false,
    login: async pin => {
      await AsyncStorage.setItem('pin', pin);
      dispatch({ type: 'login', pin: pin });
    },
    logout: async () => {
      await AsyncStorage.removeItem('pin');
      dispatch({ type: 'logout' });
    },
    signUp: async userInput => {
      await createAccount(userInput);

      await AsyncStorage.multiSet([
        ['lastName', userInput.Last_Name],
        ['email', userInput.Email],
        ['awaitingApproval', 'true'],
      ]);

      dispatch({ type: 'setAwaitingApproval', isAwaitingApproval: true });

      return Promise.resolve();
    },
  });

  // As soon as the app is mounted, try to get the user's PIN either from device storage
  // or by looking to see if they have a recently approved account.
  React.useEffect(() => {
    // The dispatch method gets passed as an argument because the tryToRestorePin function
    // may need to update the value of awaitingApproval
    tryToRestorePin(dispatch).then(restoredPin => {
      dispatch({ type: 'restore', pin: restoredPin });
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
