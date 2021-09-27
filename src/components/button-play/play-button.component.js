import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/icon/icon.component';
import { TouchableRipple } from 'react-native-paper';
import theme from 'common/theme';

const PlayButton = ({ paused, pressAction }) => (
  <TouchableRipple
    borderless
    onPress={() => pressAction()}
    style={{
      width: 80,
      height: 80,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <Icon name={paused ? 'circular-play' : 'circular-pause'} size={theme.iconSize(10)} />
  </TouchableRipple>
);

PlayButton.propTypes = {
  paused: PropTypes.bool,
  pressAction: PropTypes.func
};

export default PlayButton;
