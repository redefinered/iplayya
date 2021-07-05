import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/music/music.actions';

const AddToFavoritesButton = ({
  type,
  id,
  active,
  addAlbumToFavoritesAction,
  addTrackToFavoritesAction
}) => {
  const theme = useTheme();

  const handlePress = () => {
    if (type === 'album') return addAlbumToFavoritesAction(id);

    addTrackToFavoritesAction(id);
  };
  return (
    <Pressable onPress={() => handlePress()} style={styles.headerButtonContainer}>
      <Icon
        name="heart-solid"
        size={24}
        style={{ color: active ? theme.iplayya.colors.vibrantpussy : 'white' }}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  headerRightContainerStyle: {
    paddingRight: 15,
    justifyContent: 'flex-end'
  },
  headerButtonContainer: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15
  }
});

AddToFavoritesButton.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string,
  active: PropTypes.boolean,
  addAlbumToFavoritesAction: PropTypes.func,
  addTrackToFavoritesAction: PropTypes.func
};

const actions = {
  addAlbumToFavoritesAction: Creators.addAlbumToFavorites,
  addTrackToFavoritesAction: Creators.addTrackToFavorites
};

export default connect(null, actions)(AddToFavoritesButton);
