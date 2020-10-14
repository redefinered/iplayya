/* eslint-disable react/prop-types */

import React from 'react';
import { View, Pressable } from 'react-native';
import { TextInput } from 'react-native-paper';
import Icon from 'components/icon/icon.component';

const PasswordInput = ({ style, ...otherProps }) => {
  const [showText, setShowText] = React.useState(false);
  return (
    <View style={{ position: 'relative' }}>
      <TextInput
        mode="outlined"
        autoCapitalize="none"
        placeholder="password"
        onChangeText={(text) => console.log(text)}
        style={{ marginBottom: 10, ...style }}
        secureTextEntry={!showText}
        placeholderTextColor="rgba(255,255,255,0.5)"
        {...otherProps}
      />
      <Pressable
        onPress={() => setShowText(!showText)}
        style={{ position: 'absolute', right: 10, height: '100%', justifyContent: 'center' }}
      >
        <Icon name="eye" size={40} />
      </Pressable>
    </View>
  );
};

export default PasswordInput;
