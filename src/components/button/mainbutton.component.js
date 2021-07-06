import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

const MainButton = ({ onPress, text, style }) => {
  return (
    <TouchableRipple
      style={{
        ...style
      }}
      borderless={true}
      rippleColor="#B4166A"
      onPress={onPress}
    >
      <View style={styles.buttonContainer}>
        <Text style={styles.textContainer}>{text}</Text>
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E34398',
    borderRadius: 8
  },
  textContainer: {
    fontSize: 16,
    fontFamily: 'NotoSans-Bold',
    color: '#ffffff',
    textAlign: 'center'
  }
});

MainButton.propTypes = {
  text: PropTypes.string,
  style: PropTypes.object,
  onPress: PropTypes.func
};

export default MainButton;
