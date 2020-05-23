import * as React from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';
import { Icon, Text, useTheme } from '@ui-kitten/components';

const HomeMenuTouchableItem = ({
  text,
  iconName = 'arrow-forward-outline',
  iconColor,
  onPress,
  ...props
}) => {
  const theme = useTheme();

  return (
    <TouchableHighlight
      underlayColor={theme['background-basic-color-2']} // Prevent black background on tap
      onPress={onPress}
      {...props}
    >
      <View style={styles.row}>
        <View style={styles.iconTextContainer}>
          <Icon
            name={iconName}
            width={24}
            height={24}
            fill={iconColor || theme['color-primary-default']}
            style={{ marginRight: 10 }}
          />
          <Text category="s1">{text}</Text>
        </View>
        <Icon
          name="arrow-ios-forward-outline"
          width={24}
          height={24}
          fill={theme['color-basic-500']}
        />
      </View>
    </TouchableHighlight>
  );
};

export default HomeMenuTouchableItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  iconTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
});
