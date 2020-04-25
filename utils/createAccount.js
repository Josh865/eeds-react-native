import axios from 'axios';

const createAccount = async userInput => {
  console.log('creating account');
  // Instantiate a FormData object where we'll store all of the data we need to send
  // to the server to create the user's account.
  const formData = new FormData();

  // Add the data the user entered to the FormData object
  for (const [key, value] of Object.entries(userInput)) {
    formData.append(key, value);
  }

  // Add entries for internal use to FormData object
  formData.append('Function_ID', '6');
  formData.append('deviceToken', 'iPhone_App_User');

  // Send the data to the server to create the user's account.
  return axios.post('https://www.eeds.com/ajax_functions.aspx', formData);
};

export default createAccount;
