import React from 'react';
import PropTypes from 'prop-types';
import { Button as RNPButton } from 'react-native-paper';

const Button = ({ style, ...otherProps }) => (
  <RNPButton
    uppercase={false}
    labelStyle={{ fontWeight: 'bold' }}
    style={{ paddingVertical: 10, ...style }}
    {...otherProps}
  >
    {otherProps.children}
  </RNPButton>
);

Button.propTypes = {
  children: PropTypes.any,
  style: PropTypes.object
};

export default Button;
