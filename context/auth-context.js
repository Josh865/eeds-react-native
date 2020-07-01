import React from 'react';
import { AppState, AsyncStorage } from 'react-native';

import checkForApprovedAccount from '../utils/checkForApprovedAccount';
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
    case 'setHasPendingAccount': {
      return { ...state, hasPendingAccount: action.hasPendingAccount };
    }
    case 'setApprovedAccountPin': {
      return { ...state, approvedAccountPin: action.approvedAccountPin };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const AuthProvider = ({ children }) => {
  const [appState, setAppState] = React.useState(AppState.currentState);

  const [state, dispatch] = React.useReducer(authReducer, {
    busy: true,
    pin: null,
    hasPendingAccount: false,
    approvedAccountPin: '',
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

      dispatch({ type: 'setHasPendingAccount', hasPendingAccount: true });

      return Promise.resolve();
    },
    setHasPendingAccount: hasPendingAccount => {
      dispatch({ type: 'setHasPendingAccount', hasPendingAccount });
    },
    setApprovedAccountPin: approvedAccountPin => {
      dispatch({ type: 'setApprovedAccountPin', approvedAccountPin });
    },
  });

  // As soon as the app is mounted, try to restore the user's PIN from device storage. If
  // found, the PIN will be restored and user will be taken directly to their home menu.
  React.useEffect(() => {
    AsyncStorage.getItem('pin').then(storedPin => {
      dispatch({ type: 'restore', pin: storedPin });
    });
  }, []);

  // Listen to changes to the app's state (i.e., when it changes from being active to
  // running in the background).
  React.useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  // When the app changes from inactive to active, check to see whether they have an
  // account awaiting review.
  React.useEffect(() => {
    if (appState !== 'active') {
      return;
    }

    checkForPendingAccount();
  }, [appState]);

  const handleAppStateChange = applicationState => {
    setAppState(applicationState);
  };

  // If the user created an account in the app, check to see whether it's been approved
  const checkForPendingAccount = async () => {
    const hasAccountAwaitingApproval = await AsyncStorage.getItem(
      'awaitingApproval'
    );

    if (!hasAccountAwaitingApproval) {
      dispatch({ type: 'setHasPendingAccount', hasPendingAccount: false });
      return;
    }

    dispatch({ type: 'setHasPendingAccount', hasPendingAccount: true });

    const newPin = await checkForApprovedAccount();

    if (newPin) {
      dispatch({
        type: 'setApprovedAccountPin',
        approvedAccountPin: String(newPin),
      });
    }
  };

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
