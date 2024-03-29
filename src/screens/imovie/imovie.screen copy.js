/* eslint-disable react/prop-types */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Banner, withTheme } from 'react-native-paper';
import Spacer from 'components/spacer.component';
import withLoader from 'components/with-loader.component';
import ScreenContainer from 'components/screen-container.component';
import ImovieBottomTabs from './imovie-bottom-tabs.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import { Creators } from 'modules/ducks/movies/movies.actions';
import Icon from 'components/icon/icon.component';
import {
  selectError,
  selectIsFetching,
  selectMovies,
  selectCategoriesOf,
  selectPaginatorInfo,
  selectCategoryPaginator
} from 'modules/ducks/movies/movies.selectors';
import { urlEncodeTitle } from 'utils';
import CategoryScroll from 'components/category-scroll/category-scroll.component';

const ImovieScreen = ({
  isFetching,
  navigation,
  error,
  getMoviesAction,
  paginatorInfo,
  addMovieToFavoritesStartAction,
  theme,
  route: { params },
  categoryPaginator,
  ...rest
}) => {
  const [positions, setPositions] = React.useState({});
  const [scrollOffset, setScrollOffset] = React.useState(0); /// scroll offset if a category is selected from search
  const [showBanner, setShowBanner] = React.useState(true);
  React.useEffect(() => {
    addMovieToFavoritesStartAction();
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

  let movies = [];

  if (typeof rest.movies === 'undefined') {
    movies = [];
  } else {
    movies = rest.movies.map(({ thumbnail, ...rest }) => {
      return {
        thumbnail:
          thumbnail === '' || thumbnail === 'N/A'
            ? `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle(rest.title)}`
            : thumbnail,
        ...rest
      };
    });
  }

  // get movies on mount
  React.useEffect(() => {
    if (paginatorInfo.length) {
      getMoviesAction(paginatorInfo, categoryPaginator);
    }
  }, [paginatorInfo]);

  const handleMovieSelect = (videoId) => {
    navigation.navigate('MovieDetailScreen', { videoId });
  };

  const renderEmpty = () => {
    return <Text>No movies found</Text>;
  };

  const handleSetItemsPosition = (index, layout) => {
    const shallow = positions;
    const newPositions = Object.assign(shallow, { [index]: layout });
    setPositions(newPositions);
  };

  const handleRetry = () => {
    if (paginatorInfo.length) {
      getMoviesAction(paginatorInfo);
    }
    setShowBanner(false);
  };

  // show error banner on error
  React.useEffect(() => {
    if (error) {
      setShowBanner(true);
    }
  }, [error]);

  const renderErrorBanner = () => {
    if (!error) return;

    return (
      <Banner
        visible={showBanner}
        actions={[
          {
            label: 'Retry',
            onPress: () => handleRetry()
          }
        ]}
        icon={({ size }) => (
          <Icon name="alert" size={size} color={theme.iplayya.colors.vibrantpussy} />
        )}
      >
        <Text style={{ color: 'black' }}>{error}</Text>
      </Banner>
    );
  };

  return (
    <View style={styles.container}>
      {renderErrorBanner()}
      {movies.length ? (
        <React.Fragment>
          <ScrollView contentOffset={{ y: scrollOffset }}>
            {movies.map(({ category }) => {
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

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <ImovieScreen {...props} />
  </ScreenContainer>
);

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
  categoryPaginator: selectCategoryPaginator,
  categories: selectCategoriesOf('movies')
});

const actions = {
  getMoviesAction: Creators.getMovies,
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible,
  addMovieToFavoritesStartAction: Creators.addMovieToFavoritesStart
};

const enhance = compose(connect(mapStateToProps, actions), withTheme, withLoader);

export default enhance(Container);
