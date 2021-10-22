import React from 'react';
import PropTypes from 'prop-types';
import { TouchableRipple } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import theme from 'common/theme';

const NextButton = ({ disabled, pressAction, iconName, iconSize }) => (
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
    disabled={disabled}
  >
    <Icon
      name={iconName}
      size={theme.iconSize(iconSize)}
      color={disabled ? theme.iplayya.colors.white25 : 'white'}
    />
  </TouchableRipple>
);

NextButton.propTypes = {
  disabled: PropTypes.bool,
  pressAction: PropTypes.func.isRequired,
  iconName: PropTypes.string.isRequired,
  iconSize: PropTypes.number.isRequired
};

export default NextButton;
