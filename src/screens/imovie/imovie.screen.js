/* eslint-disable react/prop-types */

import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Banner, withTheme } from 'react-native-paper';
import ScreenContainer from 'components/screen-container.component';
import ImovieBottomTabs from './imovie-bottom-tabs.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators as AppActionCreators } from 'modules/app';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import { Creators } from 'modules/ducks/movies/movies.actions';
import Icon from 'components/icon/icon.component';
import { selectCategoriesOf } from 'modules/app';
import {
  selectError,
  selectIsFetching,
  selectMovies,
  selectPaginatorInfo,
  selectCategoryPaginator
} from 'modules/ducks/movies/movies.selectors';
import CategoryScroll from 'components/category-scroll/category-scroll.component';
import NetInfo from '@react-native-community/netinfo';
import ImovieWalkthrough from 'components/walkthrough-guide/imovie-walkthrough.component';
import RNFetchBlob from 'rn-fetch-blob';
import { downloadPath } from 'utils';

import withNotifRedirect from 'components/with-notif-redirect.component';
import { MovieContext } from 'contexts/providers/movie/movie.provider';
// import differenceBy from 'lodash/differenceBy';

const CARD_DIMENSIONS = { WIDTH: 115, HEIGHT: 170 };

const ImovieScreen = ({
  resetAction,
  isFetching,
  navigation,
  error,
  getMoviesAction,
  paginatorInfo,
  // addMovieToFavoritesStartAction,
  theme,
  route: { params },
  categoryPaginator,
  movies,
  enableSwipeAction,
  setNetworkInfoAction,
  getMoviesStartAction
  // getMovieThumbnailsAction,
  // thumbnails
}) => {
  const { selected, setSelected, downloads, setDownloads } = React.useContext(MovieContext);

  const brand = theme.iplayya.colors;

  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = React.useState(
    true
  );
  // const [data, setData] = React.useState([]);
  const [scrollIndex, setScrollIndex] = React.useState(0);
  const [showBanner, setShowBanner] = React.useState(true);
  const [showWalkthroughGuide, setShowWalkthroughGuide] = React.useState(false);

  React.useEffect(() => {
    /// resets the category paginator
    resetAction();
    // addMovieToFavoritesStartAction();
    setSelected(null);

    // Subscribe to network changes
    const unsubscribe = NetInfo.addEventListener(({ type, isConnected }) => {
      setNetworkInfoAction({ type, isConnected });
    });

    const unsubscribeToNav = navigation.addListener('beforeRemove', () => {
      getMoviesStartAction();
    });

    enableSwipeAction(false);

    getInitialContent();

    // getMovieThumbnails(movies);

    // Unsubscribe
    return () => {
      unsubscribeToNav;
      unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    if (!selected) return;

    const { id: videoId, is_series } = selected;

    if (is_series) return navigation.navigate('SeriesDetailScreen', { videoId });

    navigation.navigate('MovieDetailScreen', { videoId }); // set to true temporarily
  }, [selected]);

  React.useEffect(() => {
    // console.log({ data });
    if (typeof params !== 'undefined') {
      const { categoryName } = params;

      return setScrollIndex(movies.findIndex((c) => c.category === categoryName));
    }
    setScrollIndex(0);
  }, [params, movies]);

  const getInitialContent = async () => {
    if (!paginatorInfo.length) return;

    if (isFetching) return; /// stop if another request is running

    getMoviesAction(paginatorInfo, categoryPaginator);

    const downloadsList = await RNFetchBlob.fs.ls(downloadPath);
    setDownloads(downloadsList);
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

  const renderEmptyErrorBanner = () => {
    if (error === '')
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

  const renderItem = ({ item: { category } }) => {
    if (typeof movies === 'undefined') return;

    return <CategoryScroll category={category} />;
  };

  const handleEndReached = () => {
    if (!onEndReachedCalledDuringMomentum) {
      setOnEndReachedCalledDuringMomentum(true);

      if (isFetching) return; /// stop if another request is running

      getMoviesAction(paginatorInfo, categoryPaginator);
    }
  };

  React.useEffect(() => {
    if (typeof params !== 'undefined') {
      const { openImoviesGuide } = params;
      if (!openImoviesGuide) return;
      setShowWalkthroughGuide(true);
    }
  }, [params]);

  const handleWalkthroughGuideHide = () => {
    setShowWalkthroughGuide(false);
  };

  const renderListFooter = () => {
    if (!isFetching) return;

    return (
      <View style={{ flexDirection: 'row' }}>
        <View
          style={{
            width: CARD_DIMENSIONS.WIDTH,
            height: CARD_DIMENSIONS.HEIGHT,
            backgroundColor: brand.white10,
            borderRadius: 8,
            justifyContent: 'center',
            marginLeft: theme.spacing(2)
          }}
        />
        <View
          style={{
            width: CARD_DIMENSIONS.WIDTH,
            height: CARD_DIMENSIONS.HEIGHT,
            backgroundColor: brand.white10,
            borderRadius: 8,
            justifyContent: 'center',
            marginLeft: theme.spacing(2)
          }}
        />
        <View
          style={{
            width: CARD_DIMENSIONS.WIDTH,
            height: CARD_DIMENSIONS.HEIGHT,
            backgroundColor: brand.white10,
            borderRadius: 8,
            justifyContent: 'center',
            marginLeft: theme.spacing(2)
          }}
        />
      </View>
    );
  };

  const renderList = () => {
    if (!downloads) return;

    return (
      <FlatList
        data={movies}
        showsVerticalScrollIndicator={false}
        keyExtractor={(movie) => movie.category}
        renderItem={renderItem}
        initialScrollIndex={scrollIndex}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
        ListFooterComponent={renderListFooter()}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderErrorBanner()}
      {renderEmptyErrorBanner()}

      {renderList()}

      <ImovieBottomTabs />

      <ImovieWalkthrough
        visible={showWalkthroughGuide}
        onButtonClick={handleWalkthroughGuideHide}
      />
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
  resetAction: Creators.reset,
  setNetworkInfoAction: AppActionCreators.setNetworkInfo,
  getMoviesAction: Creators.getMovies,
  getMoviesStartAction: Creators.getMoviesStart,
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible,
  addMovieToFavoritesStartAction: Creators.addMovieToFavoritesStart,
  enableSwipeAction: NavActionCreators.enableSwipe,
  getFavoritesAction: Creators.getFavoriteMovies,
  getMovieThumbnailsAction: Creators.getMovieThumbnails
};

const enhance = compose(connect(mapStateToProps, actions), withTheme, withNotifRedirect);

export default enhance(Container);
