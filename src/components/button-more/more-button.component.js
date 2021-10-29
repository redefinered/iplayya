import React from 'react';
import PropTypes from 'prop-types';
import { TouchableRipple } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import theme from 'common/theme';

const MoreButton = ({ disabled, pressAction, data }) => (
  <TouchableRipple
    borderless
    style={{
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center'
    }}
    onPress={() => pressAction(data)}
    disabled={disabled}
  >
    <Icon
      name="more"
      size={theme.iconSize(3)}
      color={disabled ? theme.iplayya.colors.white25 : 'white'}
    />
  </TouchableRipple>
);

MoreButton.propTypes = {
  disabled: PropTypes.bool,
  pressAction: PropTypes.func,
  data: PropTypes.object
};

export default MoreButton;
