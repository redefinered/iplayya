import React from 'react';
import PropTypes from 'prop-types';
import { Pressable } from 'react-native';
import Icon from 'components/icon/icon.component';
import theme from 'common/theme';

const FavoriteButton = ({ id, pressAction, isFavorite }) => {
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    setActive(isFavorite);
  }, [isFavorite]);

  const handlePressAction = () => {
    setActive(true);

    pressAction(id);
  };

  return (
    <Pressable
      onPress={() => handlePressAction()}
      style={({ pressed }) => [
        {
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: pressed ? 'rgba(0,0,0,0.28)' : 'transparent',
          justifyContent: 'center',
          alignItems: 'center'
        }
      ]}
    >
      <Icon
        name="heart-solid"
        size={theme.iconSize(3)}
        style={{
          color: active ? theme.iplayya.colors.vibrantpussy : 'white'
        }}
      />
    </Pressable>
  );
};

FavoriteButton.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  pressAction: PropTypes.func,
  isFavorite: PropTypes.bool
};

export default FavoriteButton;
