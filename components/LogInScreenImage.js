import React from 'react';
import { Image, useWindowDimensions } from 'react-native';
import { Appearance } from 'react-native-appearance';

import Doctors from '../assets/doctors.svg';

// Detect which theme the user's device is using
const deviceThemeSetting = Appearance.getColorScheme();

const LogInScreenImage = ({ imageUrl }) => {
  const windowWidth = useWindowDimensions().width;

  // If no custom image associated with the selected log in method, use generic image.
  // TODO: For now, if the user's device is in dark mode, we show the generic image even
  // if we have the sponsor's logo. This is because most logos are not transparent and so
  // look bad on the dark background.
  if (imageUrl === null || deviceThemeSetting === 'dark') {
    return <Doctors width={windowWidth * 0.75} style={{ maxHeight: 200 }} />;
  }

  // If the user isn't in dark mode, we can return the image as-is
  return (
    <Image
      source={{ uri: imageUrl }}
      style={{ width: windowWidth * 0.75, height: 150 }}
      resizeMode={'contain'}
    />
  );
};

export default LogInScreenImage;
