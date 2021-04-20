import React from 'react';
import PropTypes from 'prop-types';
import { TextInput as RNPTextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  textField: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 0,
    borderColor: 'transparent'
  },
  textFiledFocused: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    color: 'rgba(255,255,255,0.5)'
  }
});

const TextInput = ({ style, name, handleChangeText, ...otherProps }) => {
  const [focused, setFocused] = React.useState(false);
  const customStyle = focused ? styles.textFiledFocused : styles.textField;
  return (
    <RNPTextInput
      mode="outlined"
      selectionColor={'#E34398'}
      onChangeText={(text) => handleChangeText(text, name)}
      style={{ marginBottom: 10, ...customStyle }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholderTextColor={focused ? '#FFFFFF' : 'rgba(225,225,225,0.5)'}
      theme={{ colors: { primary: 'rgba(255,255,255,0.1)' } }}
      {...otherProps}
    />
  );
};

TextInput.propTypes = {
  style: PropTypes.object,
  name: PropTypes.string,
  handleChangeText: PropTypes.func
};

export default TextInput;
