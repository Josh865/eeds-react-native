import * as React from 'react';
import axios from 'axios';

import { useAuth } from './auth-context';

const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const { pin } = useAuth();
  const [userInfo, setUserInfo] = React.useState();

  React.useEffect(() => {
    if (!pin) {
      return;
    }

    axios
      .get(
        `https://www.eeds.com/ajax_functions.aspx?Function_ID=150&PIN=${pin}`
      )
      .then(({ data }) => {
        setUserInfo({
          pin: data.PIN,
          firstName: data.First_Name,
          lastName: data.Last_Name,
          degree: data.Degree,
          specialty: data.Specialty,
          fullName: data.Full_Name,
          practiceName: data.Practice_Name,
          city: data.City,
          state: data.State,
        });
      });
  }, [pin]);

  return (
    <UserContext.Provider value={{ ...userInfo }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = React.useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};

export { UserProvider, useUser };
