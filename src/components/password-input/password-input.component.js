/* eslint-disable react/prop-types */

import React from 'react';
import { View, Pressable } from 'react-native';
import { TextInput } from 'react-native-paper';
import Icon from 'components/icon/icon.component';

const PasswordInput = ({ style, name, handleChangeText, ...otherProps }) => {
  const [showText, setShowText] = React.useState(false);
  return (
    <View style={{ position: 'relative' }}>
      <TextInput
        mode="outlined"
        autoCapitalize="none"
        placeholder="password"
        onChangeText={(text) => handleChangeText(text, name)}
        style={{ marginBottom: 10, ...style }}
        secureTextEntry={!showText}
        placeholderTextColor="rgba(255,255,255,0.5)"
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
          width: 40
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
