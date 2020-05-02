import axios from 'axios';
import { AsyncStorage } from 'react-native';

const tryToRestorePin = async dispatch => {
  let pin;

  // First, try to retrieve the user's PIN from their device. If they've
  // used the app before (and haven't logged out), we should have it.
  pin = await AsyncStorage.getItem('pin');

  // If we don't have their PIN in storage and they created an account in the app,
  // check to see if the account has been approved (and therefore assigned a PIN)
  if (!pin) {
    const accountAwaitingApproval = await AsyncStorage.getItem(
      'awaitingApproval'
    );

    if (accountAwaitingApproval === 'true') {
      // We assumed they weren't awaiting approval, but now that we know they are,
      // we need to update the component state.
      dispatch({ type: 'setAwaitingApproval', isAwaitingApproval: true });

      pin = await getApprovedAccountPin();
    }

    // If their account was approved, remove the flag indicating that their account
    // was awaiting approval
    if (pin) {
      dispatch({ type: 'setAwaitingApproval', isAwaitingApproval: false });

      AsyncStorage.removeItem('awaitingApproval');
    }
  }

  // At this point, we've looked everywhere for the user's PIN
  return Promise.resolve(pin ? pin : null);
};

export default tryToRestorePin;

async function getApprovedAccountPin() {
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
