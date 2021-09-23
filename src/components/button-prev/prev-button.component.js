import React from 'react';
import PropTypes from 'prop-types';
import { TouchableRipple } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import theme from 'common/theme';

const PrevButton = ({ disabled, pressAction }) => (
  <TouchableRipple
    borderless
    style={{
      width: 54,
      height: 54,
      borderRadius: 27,
      alignItems: 'center',
      justifyContent: 'center'
    }}
    onPress={() => pressAction()}
    disabled={disabled}
  >
    <Icon
      name="previous"
      size={theme.iconSize(5)}
      color={disabled ? theme.iplayya.colors.white25 : 'white'}
    />
  </TouchableRipple>
);

PrevButton.propTypes = {
  disabled: PropTypes.bool,
  pressAction: PropTypes.func
};

export default PrevButton;
