import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import theme from 'common/theme';

const RepeatButton = ({ repeat, pressAction }) => {
  const getRepeatColor = () => {
    if (repeat.order !== 1) return theme.iplayya.colors.vibrantpussy;

    /// normal color
    return 'white';
  };

  return (
    <TouchableRipple
      borderless
      style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onPress={() => pressAction()}
    >
      <View>
        <Icon name="repeat" size={theme.iconSize(3)} style={{ color: getRepeatColor() }} />
        <Text
          style={{
            position: 'absolute',
            top: 0,
            right: -8,
            fontWeight: 'bold',
            color: getRepeatColor(),
            opacity: repeat.order === 3 ? 1 : 0
          }}
        >
          1
        </Text>
      </View>
    </TouchableRipple>
  );
};

RepeatButton.propTypes = {
  repeat: PropTypes.object,
  pressAction: PropTypes.func
};

export default RepeatButton;
