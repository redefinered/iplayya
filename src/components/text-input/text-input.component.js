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

const TextInput = ({ style, name, handleChangeText, focusAction, ...otherProps }) => {
  const [focused, setFocused] = React.useState(false);
  const customStyle = focused ? styles.textFiledFocused : styles.textField;
  const handleFocused = () => {
    if (typeof focusAction !== 'undefined') {
      focusAction();
    }
    setFocused(true);
  };
  return (
    <RNPTextInput
      mode="outlined"
      selectionColor={'#E34398'}
      onChangeText={(text) => handleChangeText(text, name)}
      style={{ marginBottom: 10, height: 30, ...style, ...customStyle }}
      onFocus={() => handleFocused()}
      onBlur={() => setFocused(false)}
      placeholderTextColor={focused ? '#FFFFFF' : 'rgba(225,225,225,0.5)'}
      theme={{
        colors: { primary: 'rgba(255,255,255,0.1)', error: '#E34398', placeholder: 'transparent' }
      }}
      ref={(ref) => ref && ref.setNativeProps({ style: { fontFamily: 'NotoSans', height: 50 } })}
      {...otherProps}
    />
  );
};

TextInput.propTypes = {
  focusAction: PropTypes.func,
  style: PropTypes.object,
  name: PropTypes.string,
  handleChangeText: PropTypes.func
};

export default TextInput;
