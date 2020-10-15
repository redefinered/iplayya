import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Button as RNPButton } from 'react-native-paper';

const Button = ({ style, ...otherProps }) => (
  <View style={{ minHeight: 64, justifyContent: 'flex-end', ...style }}>
    <RNPButton
      uppercase={false}
      labelStyle={{ fontWeight: 'bold' }}
      style={{ paddingVertical: 10 }}
      {...otherProps}
    >
      {otherProps.children}
    </RNPButton>
  </View>
);

Button.propTypes = {
  children: PropTypes.any,
  style: PropTypes.object
};

export default Button;
