/* eslint-disable react/prop-types */
import React from 'react';
import { Text, View, withTheme } from 'react-native-paper';
import Spacer from 'components/spacer.component';
import Button from 'components/button/button.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import withLoader from 'components/with-loader.component';
import ImovieBottomTabs from 'screens/imovie/imovie-bottom-tabs.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectIsFetching,
  selectFavorites
} from 'modules/ducks/movies/movies.selectors';
import { NoFavorites } from 'assets/favorite-movies-empty-state.svg';

const ImovieFavoritesScreen = ({ navigation, favorites }) => {
  const renderMain = () => {
    if (favorites.length) {
      return <Text>display favorites list</Text>;
    }
    return <NoProviders navigation={navigation} />;
  };

  return (
    <View style={{ flex: 1 }}>
      {renderMain()}
      <ImovieBottomTabs navigation={navigation} />
    </View>
  );
};

const NoProviders = ({ navigation }) => (
  <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 130
    }}
  >
    <NoFavorites />
    <Spacer />
    <Text style={{ fontSize: 24 }}>No favorites yet</Text>
    <Spacer />
    <Button onPress={() => navigation.navigate('ImovieScreen')}>
      Heart a movie to add to your favorites list.
    </Button>
  </View>
);

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  favorites: selectFavorites
});

export default compose(
  withHeaderPush(),
  connect(mapStateToProps),
  withLoader,
  withTheme
)(ImovieFavoritesScreen);
