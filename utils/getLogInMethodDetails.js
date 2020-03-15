import * as Yup from 'yup';

export default function getLogInMethodDetails(
  selectedLogInMethod,
  customField = null
) {
  const availableLogInMethods = {
    pin: {
      label: 'PIN',
      image: null,
      instructions: null,
      keyboardType: 'numeric',
      url: `https://www.eeds.com/ajax_functions.aspx?Function_ID=5&PIN=`,
      validationSchema: Yup.object({
        value: Yup.string()
          .trim()
          .required('Required')
          .length(8, 'Your PIN must be exactly eight numbers'),
      }),
    },
    email: {
      label: 'Email',
      image: null,
      instructions: null,
      keyboardType: 'email-address',
      url: `https://www.eeds.com/ajax_functions.aspx?Function_ID=50&Email_Address=`,
      validationSchema: Yup.object({
        value: Yup.string()
          .trim()
          .required('Required')
          .email('Please enter a valid email address'),
      }),
    },
    phone: {
      label: 'Phone',
      image: null,
      instructions: null,
      keyboardType: 'phone-pad',
      url: `https://www.eeds.com/ajax_functions.aspx?Function_ID=50&Phone_Number=`,
      validationSchema: Yup.object({
        value: Yup.string()
          .trim()
          .required(),
      }),
    },
    custom: {
      label: customField?.Custom_Field_Name,
      image: `https://www.eeds.com/${customField?.Login_Logo}`,
      instructions: customField?.Login_Instructions,
      keyboardType: 'default',
      url: `https://www.eeds.com/ajax_functions.aspx?Function_ID=5&Custom_Field_ID=${customField?.Custom_Field_ID}&PIN=`,
      validationSchema: Yup.object({
        value: Yup.string()
          .trim()
          .required('Required'),
      }),
    },
  };

  return availableLogInMethods[selectedLogInMethod];
}
