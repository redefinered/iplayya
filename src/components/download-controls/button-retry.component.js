import React from 'react';
import PropTypes from 'prop-types';
import { Pressable } from 'react-native';
import Icon from 'components/icon/icon.component';
import theme from 'common/theme';

const ButtonRetry = ({ broken, handlePress }) => {
  const [isPressed, setIsPressed] = React.useState(false);

  if (!broken) return;

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
      <Icon name="redo" size={theme.iconSize(5)} />
    </Pressable>
  );
};

ButtonRetry.propTypes = { broken: PropTypes.bool, handlePress: PropTypes.func };

export default React.memo(ButtonRetry);
