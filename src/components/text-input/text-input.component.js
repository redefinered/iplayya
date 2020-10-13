import React from 'react';
import PropTypes from 'prop-types';
import { TextInput as RNPTextInput } from 'react-native-paper';

const TextInput = ({ style, ...otherProps }) => (
  <RNPTextInput
    mode="outlined"
    onChangeText={(text) => console.log(text)}
    style={{ marginBottom: 10, ...style }}
    placeholderTextColor="rgba(255,255,255,0.5)"
    {...otherProps}
  />
);

TextInput.propTypes = {
  style: PropTypes.object
};

export default TextInput;
