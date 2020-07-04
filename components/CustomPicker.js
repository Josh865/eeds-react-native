import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  Picker,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';
import { useField } from 'formik';
import { Button, Divider, Layout, Text } from '@ui-kitten/components';
import { useColorScheme } from 'react-native-appearance';

// This is exported component, which simply checks the device's OS and renders whichever
// one of the custom picker components defined below is applicable.
const CustomPicker = props => {
  if (Platform.OS === 'android') {
    return <CustomPickerAndroid {...props} />;
  }

  return <CustomPickerIOS {...props} />;
};

export default CustomPicker;

// The picker control will render the native Android/iOS picker. It's wrapped in a custom
// component so changes to the actual Picker don't have be done in both the Android
// wrapper (CustomPickerAndroid below) and iOS wrapper (CustomPickerIOS below).
const PickerControl = ({
  items,
  selectedValue,
  valueKey,
  labelKey,
  placeholderItem,
  handleChange,
  ...props
}) => {
  const colorScheme = useColorScheme(); // Device color scheme (light or dark)

  return (
    <Picker
      selectedValue={selectedValue}
      itemStyle={{ color: colorScheme === 'dark' ? 'white' : 'inherit' }}
      onValueChange={handleChange}
      {...props}
    >
      {placeholderItem && (
        <Picker.Item key="placeholder" label={placeholderItem} value="" />
      )}
      {items.map(item => (
        <Picker.Item
          key={item[valueKey]}
          label={item[labelKey]}
          value={item[valueKey]}
        />
      ))}
    </Picker>
  );
};

// The Android implementation is simpler than the iOS implementation, since the OS handles
// putting the picker inside a modal. When the picker is not visible, the UI is similar to
// a select control on the web.
const CustomPickerAndroid = ({
  items,
  labelKey,
  valueKey,
  label,
  name,
  style,
  onChange,
  ...props
}) => {
  // eslint-disable-next-line no-unused-vars
  const [field, meta, helpers] = useField(name);
  const { error, touched, value } = meta;
  const { setTouched, setValue } = helpers;

  const showError = error && touched;

  const handleChange = (itemValue, itemIndex) => {
    setTouched(true);
    setValue(itemValue);

    // If an onChange callback was provided, execute it with the selected value
    if (typeof onChange === 'function') {
      onChange(itemValue);
    }
  };

  return (
    <>
      <Layout style={style}>
        <Text
          appearance="hint"
          category="s1"
          status={showError && 'danger'}
          style={styles.labelText}
        >
          {label}
        </Text>
        <PickerControl
          items={items}
          selectedValue={value}
          labelKey={labelKey}
          valueKey={valueKey}
          placeholderItem={`Select ${label}`}
          style={styles.androidPicker}
          itemStyle={{ fontSize: 10 }}
          onValueChange={handleChange}
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

// The iOS picker is opened in a modal at the bottom of the screen. Because it's opened in
// a modal, its implementation is sufficiently different from the Android implementation
// to warrant a separate component.
const CustomPickerIOS = ({
  items,
  labelKey,
  valueKey,
  label,
  name,
  prompt,
  style,
  onChange,
  ...props
}) => {
  // eslint-disable-next-line no-unused-vars
  const [field, meta, helpers] = useField(name);
  const { error, touched, value } = meta;
  const { setTouched, setValue } = helpers;

  const showError = error && touched;

  // Whether the picker is shown in a modal at the bottom of the screen
  const [isVisible, setIsVisible] = useState(false);

  // Since the selected value is hidden after it's selected, the selected value is
  // displayed as text inline with the form label.
  const [selectedValueText, setSelectedValueText] = useState(prompt);

  // Blur active input and dismiss keyboard when Picker is visible
  useEffect(() => {
    if (isVisible) {
      Keyboard.dismiss();
    }
  }, [isVisible]);

  // Whenever the value of the form changes, update what's displayed as the placeholder
  useEffect(() => {
    // Find the item from the options supplied to the picker that corresponds to the
    // selected value. Loose checking for number/string comparison.
    // eslint-disable-next-line eqeqeq
    const selectedItem = items.find(item => item[valueKey] == value);

    if (selectedItem) {
      setSelectedValueText(selectedItem[labelKey]);
      return;
    }

    setSelectedValueText(prompt);
  }, [value, items, labelKey, valueKey, prompt]);

  const handleChange = (itemValue, itemIndex) => {
    // Update Formik state
    setTouched(true);
    setValue(itemValue);

    // If an onChange callback was provided, execute it with the selected value
    if (typeof onChange === 'function') {
      onChange(itemValue);
    }
  };

  return (
    <>
      <Layout style={style}>
        <Text
          appearance="hint"
          category="s1"
          status={showError && 'danger'}
          style={styles.labelText}
        >
          {label}
        </Text>
        <TouchableWithoutFeedback onPress={() => setIsVisible(!isVisible)}>
          <Layout style={styles.iOSSelectedValueTextContainer}>
            <Text style={{ fontSize: 16 }}>{selectedValueText}</Text>
          </Layout>
        </TouchableWithoutFeedback>
        {showError && (
          <Text category="c1" status="danger">
            {error}
          </Text>
        )}

        <Modal
          isVisible={isVisible}
          style={{ margin: 0 }}
          onBackdropPress={() => setIsVisible(false)}
          onModalHide={() => setTouched(true)}
        >
          <Layout level="3" style={styles.iOSPickerContainer}>
            <Layout level="4" style={styles.iOSModalHeader}>
              <Button appearance="ghost" onPress={() => setIsVisible(false)}>
                Done
              </Button>
            </Layout>
            <Divider />
            <PickerControl
              items={items}
              selectedValue={value}
              labelKey={labelKey}
              valueKey={valueKey}
              placeholderItem={`Select ${label}`}
              style={{ flex: 1 }}
              onValueChange={handleChange}
              {...props}
            />
          </Layout>
        </Modal>
      </Layout>
      <Divider />
    </>
  );
};

const formControlHeight = 40;

const styles = StyleSheet.create({
  labelText: {
    width: 115,
  },

  androidPicker: {
    flex: 1,
    height: formControlHeight,
  },

  iOSPickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 280,
  },

  iOSModalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 6,
  },

  iOSSelectedValueTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: formControlHeight,
  },
});
