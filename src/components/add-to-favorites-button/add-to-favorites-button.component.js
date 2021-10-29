import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'components/icon/icon.component';
import { connect } from 'react-redux';
import { Creators as ItvCreators } from 'modules/ducks/itv/itv.actions';
import { Creators as MoviesCreators } from 'modules/ducks/movies/movies.actions';
import { Creators as IsportsCreators } from 'modules/ducks/isports/isports.actions';
import theme from 'common/theme';

const AddToFavoritesButton = ({ sub, pressAction, active }) => {
  const [colored, setColored] = React.useState(false);

  React.useEffect(() => {
    setColored(active);
  }, [active]);

  const handleAddAction = () => {
    if (active) return;

    setColored(true);

    pressAction(sub);
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
        }
      ]}
    >
      <View style={styles.headerButtonContainer}>
        <Icon
          name="heart-solid"
          size={theme.iconSize(3)}
          style={{ color: colored ? theme.iplayya.colors.vibrantpussy : 'white' }}
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
  }
});

AddToFavoritesButton.propTypes = {
  sub: PropTypes.any,
  pressAction: PropTypes.func,
  active: PropTypes.bool
};

const actions = {
  addChannelToFavoritesAction: ItvCreators.addToFavorites,
  addMovieToFavoritesAction: MoviesCreators.addMovieToFavorites,
  addIsportChannelToFavoritesAction: IsportsCreators.addToFavorites
};

export default connect(null, actions)(AddToFavoritesButton);
