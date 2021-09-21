import React from 'react';
import PropTypes from 'prop-types';
import { TouchableRipple } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import theme from 'common/theme';

const NextButton = ({ disabled, pressAction }) => (
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
      name="next"
      size={theme.iconSize(5)}
      style={{ color: disabled ? theme.iplayya.colors.white25 : 'white' }}
    />
  </TouchableRipple>
);

NextButton.propTypes = {
  disabled: PropTypes.bool,
  pressAction: PropTypes.func
};

export default NextButton;
