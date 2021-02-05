/* eslint-disable react/prop-types */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import Spacer from 'components/spacer.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import withLoader from 'components/with-loader.component';
import ImovieBottomTabs from './imovie-bottom-tabs.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import { Creators as MoviesCreators } from 'modules/ducks/movies/movies.actions';
import {
  selectError,
  selectIsFetching,
  selectMovies,
  selectCategoriesOf,
  selectPaginatorInfo
} from 'modules/ducks/movies/movies.selectors';
import { urlEncodeTitle } from 'utils';
import { setupPaginator } from './imovie.utils';
import CategoryScroll from 'components/category-scroll/category-scroll.component';

const ImovieScreen = ({
  getMoviesStartAction,
  navigation,
  error,
  categories,
  getMoviesAction,
  setupPaginatorInfoAction,
  paginatorInfo,
  addMovieToFavoritesStartAction,
  ...rest
}) => {
  // reset 'added' state when adding a movie to favorites to prevent conflicts
  React.useEffect(() => {
    addMovieToFavoritesStartAction();
    getMoviesStartAction();
  }, []);

  let movies = rest.movies.map(({ thumbnail, ...rest }) => {
    return {
      thumbnail:
        thumbnail === '' || thumbnail === 'N/A'
          ? `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle(rest.title)}`
          : thumbnail,
      ...rest
    };
  });

  React.useEffect(() => {
    if (!paginatorInfo.length) {
      const paginator = setupPaginator(categories);
      setupPaginatorInfoAction(paginator);
    }
  }, [paginatorInfo]);

  // get movies on mount
  React.useEffect(() => {
    getMoviesAction(paginatorInfo);
  }, [paginatorInfo]);

  if (error) {
    <Text>{error}</Text>;
  }

  const handleMovieSelect = (videoId) => {
    navigation.navigate('MovieDetailScreen', { videoId });
  };

  return (
    <View style={styles.container}>
      {movies.length ? (
        <React.Fragment>
          <ScrollView>
            {/* featured items section */}
            {/* <View style={{ marginBottom: 30 }}>
              <ContentWrap>
                <Text style={{ fontSize: 16, lineHeight: 22, marginBottom: 15 }}>
                  Featured Movies
                </Text>
              </ContentWrap>
              <ScrollView style={{ paddingHorizontal: 10 }} horizontal bounces={false}>
                {featuredItems.map(({ id, ...itemProps }) => (
                  <ItemPreview
                    key={id}
                    variant="image"
                    onSelect={handleMovieSelect}
                    {...itemProps}
                  />
                ))}
              </ScrollView>
            </View> */}

            {/* new releases */}
            {/* <View style={{ marginBottom: 30 }}>
              <ContentWrap>
                <Text style={{ fontSize: 16, lineHeight: 22, marginBottom: 15 }}>New Releases</Text>
              </ContentWrap>
              <ScrollView style={{ paddingHorizontal: 10 }} horizontal bounces={false}>
                {movies.map(({ id, thumbnail: url }) => (
                  <Pressable key={id} style={{ marginRight: 10 }}>
                    <Image style={{ width: 115, height: 170, borderRadius: 8 }} source={{ url }} />
                  </Pressable>
                ))}
              </ScrollView>
            </View> */}

            {movies.map(({ category }) => (
              <CategoryScroll key={category} category={category} onSelect={handleMovieSelect} />
            ))}

            {/* continue watching */}
            {/* <View style={{ marginBottom: 30, paddingBottom: 100 }}>
              <ContentWrap>
                <Text style={{ fontSize: 16, lineHeight: 22, marginBottom: 15 }}>
                  Continue watching
                </Text>
              </ContentWrap>
              <ScrollView style={{ paddingHorizontal: 10 }} horizontal bounces={false}>
                {movies.map(({ id, thumbnail: url }) => (
                  <Pressable key={id} style={{ marginRight: 10 }}>
                    <Image style={{ width: 115, height: 170, borderRadius: 8 }} source={{ url }} />
                  </Pressable>
                ))}
              </ScrollView>
            </View> */}
            <Spacer size={100} />
          </ScrollView>
        </React.Fragment>
      ) : (
        <ContentWrap>
          <Text>No movies found</Text>
        </ContentWrap>
      )}

      <ImovieBottomTabs navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  movies: selectMovies,
  paginatorInfo: selectPaginatorInfo,
  categories: selectCategoriesOf('movies')
});

const actions = {
  getMoviesStartAction: MoviesCreators.getMoviesStart,
  getMoviesAction: MoviesCreators.getMovies,
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible,
  setupPaginatorInfoAction: MoviesCreators.setupPaginatorInfo,
  addMovieToFavoritesStartAction: MoviesCreators.addMovieToFavoritesStart
};

export default compose(
  withHeaderPush(),
  connect(mapStateToProps, actions),
  withLoader
)(ImovieScreen);
