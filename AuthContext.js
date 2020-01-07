import React from 'react';

export const AuthContext = React.createContext();

export const AuthContextProvider = props => (
  <AuthContext.Provider value={props.value}>
    {props.children}
  </AuthContext.Provider>
);
