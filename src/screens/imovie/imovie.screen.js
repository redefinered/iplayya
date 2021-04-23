/* eslint-disable react/prop-types */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Banner, withTheme } from 'react-native-paper';
import Spacer from 'components/spacer.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
//import withLoader from 'components/with-loader.component';
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
import { FlatList } from 'react-native-gesture-handler';

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
  movies
}) => {
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = React.useState(
    true
  );
  const [data, setData] = React.useState([]);
  /**
   * TODO: scroll index is one render late -- fix!
   * TODO: scroll index is one render late -- fix!
   * TODO: scroll index is one render late -- fix!
   * TODO: scroll index is one render late -- fix!
   * TODO: scroll index is one render late -- fix!
   * TODO: scroll index is one render late -- fix!
   * TODO: scroll index is one render late -- fix!
   * TODO: scroll index is one render late -- fix!
   * TODO: scroll index is one render late -- fix!
   */
  const [scrollIndex, setScrollIndex] = React.useState(0);
  const [showBanner, setShowBanner] = React.useState(true);

  React.useEffect(() => {
    addMovieToFavoritesStartAction();
  }, []);

  React.useEffect(() => {
    let collection = [];
    if (typeof movies === 'undefined') return setData(collection);

    collection = movies.map(({ thumbnail, ...rest }) => {
      return {
        thumbnail:
          thumbnail === '' || thumbnail === 'N/A'
            ? `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle(rest.title)}`
            : thumbnail,
        ...rest
      };
    });

    return setData(collection);
  }, [movies]);

  React.useEffect(() => {
    // console.log({ data });
    if (typeof params !== 'undefined') {
      const { categoryName } = params;
      return setScrollIndex(data.findIndex((c) => c.category === categoryName));
    }
    setScrollIndex(0);
  }, [params, data]);

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

  const handleRetry = () => {
    if (paginatorInfo.length) {
      getMoviesAction(paginatorInfo, categoryPaginator);
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

  // console.log({ movies });

  const renderItem = ({ item: { category } }) => {
    if (typeof movies === 'undefined') return;
    // console.log({ category });
    return <CategoryScroll category={category} onSelect={handleMovieSelect} />;
  };

  const handleEndReached = (info) => {
    if (!onEndReachedCalledDuringMomentum) {
      console.log('end reached!', info);
      getMoviesAction(paginatorInfo, categoryPaginator);
      setOnEndReachedCalledDuringMomentum(true);
    }
  };

  return (
    <View style={styles.container}>
      {renderErrorBanner()}
      {data.length ? (
        <React.Fragment>
          {/* <ScrollView contentOffset={{ y: scrollOffset }}>
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
          </ScrollView> */}
          <FlatList
            data={data}
            keyExtractor={(movie) => movie.category}
            renderItem={renderItem}
            initialScrollIndex={scrollIndex}
            onEndReached={(info) => handleEndReached(info)}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
          />
          <Spacer size={100} />
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
    flex: 1,
    marginTop: 10
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

const enhance = compose(
  connect(mapStateToProps, actions),
  withHeaderPush({ backgroundType: 'solid', withLoader: true }),
  withTheme
);

export default enhance(ImovieScreen);
