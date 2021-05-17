import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Button as RNPButton } from 'react-native-paper';

const Button = ({ children, style, ...otherProps }) => (
  <View style={{ minHeight: 64, justifyContent: 'flex-end' }}>
    <RNPButton
      uppercase={false}
      contentStyle={{ height: 50 }}
      labelStyle={{ fontWeight: 'bold' }}
      style={{ fontSize: 14, fontWeight: 19, ...style }}
      {...otherProps}
    >
      {children}
    </RNPButton>
  </View>
);

Button.propTypes = {
  children: PropTypes.any,
  style: PropTypes.object
};

export default Button;
