import { AsyncStorage } from 'react-native';
import axios from 'axios';

const checkForApprovedAccount = async () => {
  // Last name and email are stored on device when someone creates an account in the app
  const lastName = await AsyncStorage.getItem('lastName');
  const email = await AsyncStorage.getItem('email');

  // If either the last name or email is missing, we can't look up the account, so don't
  // bother checking.
  if (!lastName || !email) {
    return Promise.resolve(null);
  }

  // Returns an object with a "PIN" property, the value of which is a string
  const pin = await axios
    .get(
      `https://www.eeds.com/ajax_functions.aspx?Function_ID=58&Exclude_Results_if_in_Temp_Table=true&Last_Name=${lastName}&Email=${email}`
    )
    .then(({ data }) => data.PIN);

  // If the account was approved, clear the stored data
  if (pin) {
    const clearStoredInfo = async () => {
      AsyncStorage.removeItem('awaitingApproval');
      AsyncStorage.removeItem('lastName');
      AsyncStorage.removeItem('email');
    };

    clearStoredInfo();
  }

  return Promise.resolve(pin);
};

export default checkForApprovedAccount;
