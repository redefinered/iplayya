import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import { connect } from 'react-redux';
import { Creators as ItvCreators } from 'modules/ducks/itv/itv.actions';
import { Creators as MoviesCreators } from 'modules/ducks/movies/movies.actions';

const AddToFavoritesButton = ({
  sub,
  module,
  addChannelToFavoritesAction,
  addMovieToFavoritesAction,
  inFavorites
}) => {
  const theme = useTheme();

  const handleAddAction = () => {
    switch (module) {
      case 'itv':
        addChannelToFavoritesAction(sub);
        break;
      case 'imovie':
        addMovieToFavoritesAction(sub);
        break;
      case 'imusic':
        /// wip: add imusic module
        break;
      default:
        break;
    }
  };
  return (
    <Pressable onPress={() => handleAddAction()} style={styles.headerButtonContainer}>
      <Icon
        name="heart-solid"
        size={24}
        style={{ color: inFavorites ? theme.iplayya.colors.vibrantpussy : 'white' }}
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
  module: PropTypes.string,
  inFavorites: PropTypes.bool,
  sub: PropTypes.number,
  addChannelToFavoritesAction: PropTypes.func,
  addMovieToFavoritesAction: PropTypes.func
};

const actions = {
  addChannelToFavoritesAction: ItvCreators.addToFavorites,
  addMovieToFavoritesAction: MoviesCreators.addMovieToFavorites
};

export default connect(null, actions)(AddToFavoritesButton);
