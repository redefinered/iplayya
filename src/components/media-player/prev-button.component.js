import PropTypes from 'prop-types';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Icon from 'components/icon/icon.component';
import theme from 'common/theme';

const PrevButton = ({ disabled, onPress }) => {
  const [isPressed, setIsPressed] = React.useState(false);

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)} // replicates TouchableHighlight
      onPressOut={() => setIsPressed(false)} // replicates TouchableHighlight
      style={{
        backgroundColor: isPressed ? theme.iplayya.colors.black80 : 'transparent',
        opacity: isPressed ? 0.8 : 1,
        ...styles.buttonContainer
      }}
      onPress={() => onPress()}
      disabled={disabled}
    >
      <Icon
        name="previous"
        size={theme.iconSize(4)}
        style={{ color: disabled ? theme.iplayya.colors.white25 : 'white' }}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

PrevButton.propTypes = {
  onPress: PropTypes.func,
  disabled: PropTypes.bool
};

export default React.memo(PrevButton);
