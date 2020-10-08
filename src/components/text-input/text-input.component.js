import React from 'react';
import PropTypes from 'prop-types';
import { TextInput as RNPTextInput } from 'react-native-paper';

const TextInput = ({ style, ...otherProps }) => (
  <RNPTextInput
    mode="outlined"
    onChangeText={(text) => console.log(text)}
    style={{ marginBottom: 19, ...style }}
    {...otherProps}
  />
);

TextInput.propTypes = {
  style: PropTypes.object
};

export default TextInput;
