/* eslint-disable react/prop-types */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Spacer from 'components/spacer.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import withLoader from 'components/with-loader.component';
import ImovieBottomTabs from './imovie-bottom-tabs.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import { Creators } from 'modules/ducks/movies/movies.actions';
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
  isFetching,
  getMoviesStartAction,
  navigation,
  error,
  categories,
  getMoviesAction,
  setupPaginatorInfoAction,
  paginatorInfo,
  addMovieToFavoritesStartAction,
  getCategoriesAction,
  // getMoviesByCategoriesAction,
  route: { params },
  ...rest
}) => {
  const [positions, setPositions] = React.useState({});
  const [scrollOffset, setScrollOffset] = React.useState(0); /// scroll offset if a category is selected from search
  // reset 'added' state when adding a movie to favorites to prevent conflicts
  React.useEffect(() => {
    addMovieToFavoritesStartAction();
    getMoviesStartAction();
    getCategoriesAction();
  }, []);

  React.useEffect(() => {
    if (typeof params !== 'undefined') {
      /// set scroll offset if positions are set
      let layout = positions[params.categoryName];
      if (typeof layout !== 'undefined') {
        console.log({ layout });
        setScrollOffset(layout.y);
      }
    }
  }, [params, positions]);

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
    if (categories.length) {
      const paginator = setupPaginator(categories);
      setupPaginatorInfoAction(paginator);
    }
  }, [categories]);

  // get movies on mount
  React.useEffect(() => {
    if (paginatorInfo.length) {
      getMoviesAction(paginatorInfo);
    }
  }, [paginatorInfo]);

  const handleMovieSelect = (videoId) => {
    navigation.navigate('MovieDetailScreen', { videoId });
  };

  const renderEmpty = () => {
    if (error) return <Text>{error}</Text>;
    // this should only be returned if user did not subscribe to any channels
    return <Text>Working...</Text>;
  };

  const handleSetItemsPosition = (index, layout) => {
    const shallow = positions;
    const newPositions = Object.assign(shallow, { [index]: layout });
    setPositions(newPositions);
  };

  return (
    <View style={styles.container}>
      {movies.length ? (
        <React.Fragment>
          <ScrollView contentOffset={{ y: scrollOffset }}>
            {movies.map(({ category }) => {
              /// TODO: add snapToOffsets to snap the scrolling to per item start for smoother user experience
              // let split = category.split(' ');
              // let index = split.join('_');
              return (
                <View
                  key={category}
                  onLayout={({ nativeEvent: { layout } }) =>
                    handleSetItemsPosition(category, layout)
                  }
                >
                  <CategoryScroll category={category} onSelect={handleMovieSelect} />
                </View>
              );
            })}

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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {!isFetching ? renderEmpty() : null}
          <Spacer size={100} />
        </View>
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
  getMoviesStartAction: Creators.getMoviesStart,
  getCategoriesAction: Creators.getCategories,
  getMoviesAction: Creators.getMovies,
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible,
  setupPaginatorInfoAction: Creators.setupPaginatorInfo,
  addMovieToFavoritesStartAction: Creators.addMovieToFavoritesStart,
  getMoviesByCategoriesAction: Creators.getMoviesByCategories
};

export default compose(
  withHeaderPush(),
  connect(mapStateToProps, actions),
  withLoader
)(ImovieScreen);
