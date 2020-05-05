import React from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';
import { useField } from 'formik';
import { Divider, Layout, Text } from '@ui-kitten/components';

const CustomTextInput = ({ label, name, style, ...props }) => {
  // eslint-disable-next-line no-unused-vars
  const [field, meta, helpers] = useField(name);
  const { error, touched, value } = meta;
  const { setTouched, setValue } = helpers;

  const showError = error && touched;

  return (
    <>
      <Layout style={style}>
        <Text
          appearance="hint"
          category="s1"
          status={showError && 'danger'}
          style={{ width: 115 }}
        >
          {label}
        </Text>
        <TextInput
          onChangeText={input => setValue(input.toString().trim())}
          onBlur={() => setTouched(true)}
          value={value}
          style={styles.input}
          {...props}
        />
        {showError && (
          <Text category="c1" status="danger">
            {error}
          </Text>
        )}
      </Layout>
      <Divider />
    </>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  input: {
    flex: 1,
    height: 40,
    borderWidth: 0,
    fontSize: 16,
    // Bring text inline with selected value of picker
    paddingLeft: Platform.OS === 'android' ? 7 : 0,
  },
});
