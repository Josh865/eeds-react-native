import axios from 'axios';
import { AsyncStorage } from 'react-native';

export default async function getApprovedAccountPin() {
  // We'll have their last name and email if they created an account in the app
  const lastName = await AsyncStorage.getItem('lastName');
  const email = await AsyncStorage.getItem('email');

  // If either the last name or email is missing, we can't look up the account, so don't
  // bother checking.
  if (!lastName || !email) {
    return Promise.resolve(null);
  }

  // This will give us the PIN (if approved) or an empty string
  const pin = await axios
    .get(
      `https://www.eeds.com/ajax_functions.aspx?Function_ID=58&Exclude_Results_if_in_Temp_Table=true&Last_Name=${lastName}&Email=${email}`
    )
    .then(response => response.data);

  // Return the PIN or null (returning null rather than the empty string is for
  // consistency with our initial value)
  return Promise.resolve(pin ? pin : null);
}
