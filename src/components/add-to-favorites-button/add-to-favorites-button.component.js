import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import { connect } from 'react-redux';
import { Creators as ItvCreators } from 'modules/ducks/itv/itv.actions';
import { Creators as MoviesCreators } from 'modules/ducks/movies/movies.actions';
import { Creators as IsportsCreators } from 'modules/ducks/isports/isports.actions';

const AddToFavoritesButton = ({
  sub,
  module,
  addChannelToFavoritesAction,
  addMovieToFavoritesAction,
  addIsportChannelToFavoritesAction
}) => {
  const theme = useTheme();
  const [favorited, setFavorited] = React.useState(false);

  const handleAddAction = () => {
    /// stop if already in favorites
    if (!favorited) setFavorited(true);

    switch (module) {
      case 'itv':
        addChannelToFavoritesAction(sub);
        break;
      case 'imovie':
        addMovieToFavoritesAction(sub);
        break;
      case 'isports':
        addIsportChannelToFavoritesAction(sub);
        break;
      case 'imusic':
        /// wip: add imusic module
        break;
      default:
        break;
    }
  };
  return (
    <Pressable
      underlayColor={theme.iplayya.colors.black80}
      onPress={() => handleAddAction()}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? 'rgba(0,0,0,0.28)' : 'transparent',
          borderRadius: 44,
          padding: 8
          // ...styles.headerButtonContainer
        }
      ]}
    >
      <View style={styles.headerButtonContainer}>
        <Icon
          name="heart-solid"
          size={theme.iconSize(3)}
          style={{ color: favorited ? theme.iplayya.colors.vibrantpussy : 'white' }}
        />
      </View>
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
    alignItems: 'center'
    // marginLeft: 15
  }
});

AddToFavoritesButton.propTypes = {
  module: PropTypes.string,
  sub: PropTypes.number,
  addChannelToFavoritesAction: PropTypes.func,
  addMovieToFavoritesAction: PropTypes.func,
  addIsportChannelToFavoritesAction: PropTypes.func
};

const actions = {
  addChannelToFavoritesAction: ItvCreators.addToFavorites,
  addMovieToFavoritesAction: MoviesCreators.addMovieToFavorites,
  addIsportChannelToFavoritesAction: IsportsCreators.addToFavorites
};

export default connect(null, actions)(AddToFavoritesButton);
