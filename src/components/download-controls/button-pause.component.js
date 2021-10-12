import React from 'react';
import PropTypes from 'prop-types';
import { Pressable } from 'react-native';
import Icon from 'components/icon/icon.component';
import theme from 'common/theme';

const ButtonPause = ({ broken, paused, handlePlay, handlePause }) => {
  if (broken) return;

  const [isPressed, setIsPressed] = React.useState(false);
  const handlePress = () => {
    if (paused) return handlePlay();

    handlePause();
  };

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)} // replicates TouchableHighlight
      onPressOut={() => setIsPressed(false)} // replicates TouchableHighlight
      style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isPressed ? 0.5 : 1,
        backgroundColor: isPressed ? theme.iplayya.colors.white10 : 'transparent'
      }}
      onPress={handlePress}
    >
      <Icon name={paused ? 'circular-play' : 'circular-pause'} size={theme.iconSize(5)} />
    </Pressable>
  );
};

ButtonPause.propTypes = {
  broken: PropTypes.bool,
  paused: PropTypes.bool,
  handlePlay: PropTypes.func,
  handlePause: PropTypes.func
};

export default React.memo(ButtonPause);
