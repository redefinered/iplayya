import React from 'react';
import PropTypes from 'prop-types';
import { TouchableRipple } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import theme from 'common/theme';

const ShuffleButton = ({ active, pressAction }) => (
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
    <Icon
      name="shuffle"
      size={theme.iconSize(3)}
      color={active ? theme.iplayya.colors.vibrantpussy : 'white'}
    />
  </TouchableRipple>
);

ShuffleButton.propTypes = {
  active: PropTypes.bool,
  pressAction: PropTypes.func
};

export default ShuffleButton;
