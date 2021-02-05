import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/movies/movies.actions';

const AddToFavoritesButton = ({ videoId, addMovieToFavoritesAction, alreadyInFavorites }) => {
  const theme = useTheme();
  return (
    <Pressable
      onPress={() => addMovieToFavoritesAction(videoId)}
      style={styles.headerButtonContainer}
    >
      <Icon
        name="heart-solid"
        size={24}
        style={{ color: alreadyInFavorites ? theme.iplayya.colors.vibrantpussy : 'white' }}
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
  alreadyInFavorites: PropTypes.bool,
  videoId: PropTypes.number,
  addMovieToFavoritesAction: PropTypes.func
};

const actions = {
  addMovieToFavoritesAction: Creators.addMovieToFavorites
};

export default connect(null, actions)(AddToFavoritesButton);
