/* eslint-disable react/prop-types */

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import Icon from 'components/icon/icon.component';

const styles = StyleSheet.create({
  textField: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 0,
    borderColor: 'transparent',
    fontFamily: 'sans-serif'
  },
  textFiledFocused: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'sans-serif'
  }
});

const PasswordInput = ({ style, name, handleChangeText, ...otherProps }) => {
  const [showText, setShowText] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const customStyle = focused ? styles.textFiledFocused : styles.textField;
  return (
    <View style={{ position: 'relative' }}>
      <TextInput
        mode="outlined"
        autoCapitalize="none"
        placeholder="Password"
        selectionColor={'#E34398'}
        secureTextEntry={!showText}
        onChangeText={(text) => handleChangeText(text, name)}
        style={{
          marginBottom: 10,
          height: 30,
          ...style,
          ...customStyle,
          position: 'relative',
          zIndex: 1
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor={focused ? '#FFFFFF' : 'rgba(255,255,255,0.5)'}
        theme={{
          colors: {
            primary: 'rgba(255,255,255,0.1)',
            error: '#E34398',
            placeholder: 'transparent'
          },
          fonts: { regular: { fontFamily: 'NotoSans' } }
        }}
        ref={(ref) => ref && ref.setNativeProps({ style: { fontFamily: 'NotoSans', height: 50 } })}
        {...otherProps}
      />
      <Pressable
        onPress={() => setShowText(!showText)}
        style={{
          position: 'absolute',
          right: 10,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2
        }}
      >
        <Icon
          name={showText ? 'eye-off' : 'eye'}
          size={showText ? 40 : 40}
          style={{ color: 'rgba(255,255,255,0.5)' }}
        />
      </Pressable>
    </View>
  );
};

export default PasswordInput;
