import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

const fontsMap = {
  'video-settings': String.fromCharCode(0xe834)
};

const Icon = ({ name, size: fontSize, style, ...otherProps }) => (
  <Text style={{ fontFamily: 'iplayyaicons', fontSize, ...style }} {...otherProps}>
    {fontsMap[name]}
  </Text>
);

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  style: PropTypes.object
};

export default Icon;
