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
import { selectMovieCategories } from 'modules/app';
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
import uniqBy from 'lodash/uniqBy';
import orderBy from 'lodash/orderBy';

import withNotifRedirect from 'components/with-notif-redirect.component';
import { MovieContext } from 'contexts/providers/movie/movie.provider';

const CARD_DIMENSIONS = { WIDTH: 115, HEIGHT: 170 };

const getCategoryInfo = (categories, title) => {
  return categories.find(({ title: categoryTitle }) => categoryTitle === title);
};

const ImovieScreen = ({
  theme,
  error,
  movies,
  isFetching,
  navigation,
  categories,
  resetAction,
  paginatorInfo,
  getMoviesAction,
  route: { params },
  categoryPaginator,
  enableSwipeAction,
  setNetworkInfoAction,
  getMoviesStartAction
}) => {
  const list = React.useRef(null);
  const { colors } = theme.iplayya;

  const { selected, setSelected, downloads, setDownloads } = React.useContext(MovieContext);
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = React.useState(
    true
  );
  const [showBanner, setShowBanner] = React.useState(true);
  const [showWalkthroughGuide, setShowWalkthroughGuide] = React.useState(false);
  const [rowIndex, setRowIndex] = React.useState(0);
  const [rowHeights, setRowHeights] = React.useState([]);
  const [rowsOffset, setRowsOffset] = React.useState(0);
  console.log({ rowHeights });

  React.useEffect(() => {
    // stop if list is null
    if (!list.current) return;

    // stop if list is not rendered and rowHeights are empty
    if (!rowHeights.length) return;

    // do not execute while all pill are not yet rendered
    if (rowHeights.length !== movies.length) return;

    // adds item widths and set it as offset depending on the index of the selected category
    let offset = 0;
    for (let i = 0; i < rowIndex; i++) {
      const el = rowHeights[i];

      if (!el) continue;

      offset = offset + el.h;
    }

    setRowsOffset(offset);
  });

  // console.log({ rowHeights, rowIndex, rowsOffset });

  const handleCategoryOnLayout = ({ nativeEvent }, title) => {
    // console.log({ c, l: nativeEvent.layout });

    const { id, number } = getCategoryInfo(categories, title);

    const h = uniqBy([{ id, number, h: nativeEvent.layout.height + 30 }, ...rowHeights], 'id'); /// 30 is the bottom margin
    const ordered = orderBy(h, 'number', 'asc');

    setRowHeights(ordered);
  };

  React.useEffect(() => {
    console.log({ list });
    if (list.current) list.current.scrollToOffset({ offset: rowsOffset, animated: false });
  }, [rowsOffset]);

  React.useEffect(() => {
    /// resets the category paginator
    resetAction();

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

    return <CategoryScroll handleOnLayout={handleCategoryOnLayout} category={category} />;
  };

  const handleEndReached = () => {
    if (!onEndReachedCalledDuringMomentum) {
      setOnEndReachedCalledDuringMomentum(true);

      if (isFetching) return; /// stop if another request is running

      getMoviesAction(paginatorInfo, categoryPaginator);
    }
  };

  React.useEffect(() => {
    setRowsOffset(0);
    if (typeof params !== 'undefined') {
      const i = categories.findIndex(({ title }) => title === params.categoryName);

      if (i >= 0) {
        setRowIndex(i);
      }

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
            backgroundColor: colors.white10,
            borderRadius: 8,
            justifyContent: 'center',
            marginLeft: theme.spacing(2)
          }}
        />
        <View
          style={{
            width: CARD_DIMENSIONS.WIDTH,
            height: CARD_DIMENSIONS.HEIGHT,
            backgroundColor: colors.white10,
            borderRadius: 8,
            justifyContent: 'center',
            marginLeft: theme.spacing(2)
          }}
        />
        <View
          style={{
            width: CARD_DIMENSIONS.WIDTH,
            height: CARD_DIMENSIONS.HEIGHT,
            backgroundColor: colors.white10,
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
        ref={list}
        data={movies}
        showsVerticalScrollIndicator={false}
        keyExtractor={(movie) => movie.category}
        renderItem={renderItem}
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
  categories: selectMovieCategories
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
