import theme from 'common/theme';
import PropTypes from 'prop-types';
import Icon from 'components/icon/icon.component';
import { Pressable } from 'react-native';
import React from 'react';

const ButtonClose = ({ onPressAction }) => {
  const [isPressed, setIsPressed] = React.useState(false);

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)} // replicates TouchableHighlight
      onPressOut={() => setIsPressed(false)} // replicates TouchableHighlight
      onPress={() => onPressAction()}
      // onPress={() => console.log('sss')}
      style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isPressed ? 0.5 : 1,
        backgroundColor: isPressed ? theme.iplayya.colors.white10 : 'transparent'
      }}
    >
      <Icon name="close" size={theme.iconSize(5)} />
    </Pressable>
  );
};

ButtonClose.propTypes = {
  onPressAction: PropTypes.func
};

export default ButtonClose;
