import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native-paper';
import fontsMap from './fonts-map';

const Icon = ({ name, size: fontSize, color, style, ...otherProps }) => (
  <Text style={{ fontFamily: 'iplayyaicons', fontSize, color, ...style }} {...otherProps}>
    {fontsMap[name]}
  </Text>
);

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  style: PropTypes.object
};

Icon.defaultProps = {
  color: '#FFFFFF'
};

export default Icon;
