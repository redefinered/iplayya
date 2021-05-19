/* eslint-disable react/prop-types */

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import Icon from 'components/icon/icon.component';

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

const PasswordInput = ({ style, name, handleChangeText, ...otherProps }) => {
  const [showText, setShowText] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const customStyle = focused ? styles.textFiledFocused : styles.textField;
  return (
    <View style={{ position: 'relative' }}>
      <TextInput
        mode="outlined"
        autoCapitalize="none"
        placeholder="password"
        selectionColor={'#E34398'}
        onChangeText={(text) => handleChangeText(text, name)}
        style={{
          marginBottom: 10,
          height: 48,
          ...style,
          ...customStyle,
          position: 'relative',
          zIndex: 1
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        secureTextEntry={!showText}
        placeholderTextColor={focused ? '#FFFFFF' : 'rgba(255,255,255,0.5)'}
        theme={{ colors: { primary: 'rgba(255,255,255,0.1)', error: '#E34398' } }}
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
          width: 40,
          zIndex: 2
        }}
      >
        <Icon
          name={showText ? 'close' : 'eye'}
          size={showText ? 25 : 40}
          style={{ color: 'rgba(255,255,255,0.5)' }}
        />
      </Pressable>
    </View>
  );
};

export default PasswordInput;
