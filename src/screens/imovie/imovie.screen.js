/* eslint-disable react/prop-types */

import React from 'react';
import { View, StyleSheet, FlatList, InteractionManager } from 'react-native';
import { Text, Banner, withTheme } from 'react-native-paper';
import Spacer from 'components/spacer.component';
import ScreenContainer from 'components/screen-container.component';
import withLoader from 'components/with-loader.component';
import ImovieBottomTabs from './imovie-bottom-tabs.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators as AppActionCreators } from 'modules/ducks/app.reducer';
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
import CategoryScroll from 'components/category-scroll/category-scroll.component';
import NetInfo from '@react-native-community/netinfo';
import ImovieWalkthrough from 'components/walkthrough-guide/imovie-walkthrough.component';

const ImovieScreen = ({
  // isFetching,
  navigation,
  error,
  getMoviesAction,
  paginatorInfo,
  addMovieToFavoritesStartAction,
  theme,
  route: { params },
  categoryPaginator,
  movies,
  enableSwipeAction,
  setNetworkInfoAction,
  getFavoritesAction
}) => {
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = React.useState(
    true
  );
  const [data, setData] = React.useState([]);
  const [scrollIndex, setScrollIndex] = React.useState(0);
  const [showBanner, setShowBanner] = React.useState(true);
  const [showWalkthroughGuide, setShowWalkthroughGuide] = React.useState(false);
  // get movies on mount
  React.useEffect(() => {
    if (!paginatorInfo.length) return;

    getMoviesAction(paginatorInfo, categoryPaginator);

    // InteractionManager.runAfterInteractions(() => {
    //   if (categoryPaginator.page === 1) {
    //     getMoviesAction(paginatorInfo, categoryPaginator);
    //   }
    // });
  }, []);

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      addMovieToFavoritesStartAction();
      getFavoritesAction();
      enableSwipeAction(false);

      // Subscribe to network changes
      const unsubscribe = NetInfo.addEventListener(({ type, isConnected }) => {
        setNetworkInfoAction({ type, isConnected });
      });

      // Unsubscribe
      return () => unsubscribe();
    });
  }, []);

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (!movies) return;

      /// for development
      if (!movies.length) console.log('Something went wrong, albums array empty');

      setData(movies);
    });
  }, [movies]);

  React.useEffect(() => {
    // console.log({ data });
    if (typeof params !== 'undefined') {
      const { categoryName } = params;

      return setScrollIndex(data.findIndex((c) => c.category === categoryName));
    }
    setScrollIndex(0);
  }, [params, data]);

  const handleMovieSelect = ({ id: videoId, is_series }) => {
    if (is_series) return navigation.navigate('SeriesDetailScreen', { videoId });
    navigation.navigate('MovieDetailScreen', { videoId }); // set to true temporarily
  };

  // const renderEmpty = () => {
  //   return <ActivityIndicator size="small" />;
  // };

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

  // {data.length ? (
  //   <React.Fragment>
  //     {/* <ScrollView contentOffset={{ y: scrollOffset }}>
  //       {movies.map(({ category }) => {
  //         return (
  //           <View
  //             key={category}
  //             onLayout={({ nativeEvent: { layout } }) =>
  //               handleSetItemsPosition(category, layout)
  //             }
  //           >
  //             <CategoryScroll category={category} onSelect={handleMovieSelect} />
  //           </View>
  //         );
  //       })}
  //       <Spacer size={100} />
  //     </ScrollView> */}
  //     <FlatList
  //       data={data}
  //       showsVerticalScrollIndicator={false}
  //       keyExtractor={(movie) => movie.category}
  //       renderItem={renderItem}
  //       initialScrollIndex={scrollIndex}
  //       onEndReached={(info) => handleEndReached(info)}
  //       onEndReachedThreshold={0.5}
  //       onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
  //     />
  //     <Spacer size={80} />
  //   </React.Fragment>
  // ) : (
  //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //     {!isFetching ? renderEmpty() : null}
  //     <Spacer size={100} />
  //   </View>
  // )}

  return (
    <View style={styles.container}>
      {renderErrorBanner()}
      {renderEmptyErrorBanner()}

      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        keyExtractor={(movie) => movie.category}
        renderItem={renderItem}
        initialScrollIndex={scrollIndex}
        onEndReached={(info) => handleEndReached(info)}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
      />
      <Spacer size={80} />

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
  setNetworkInfoAction: AppActionCreators.setNetworkInfo,
  getMoviesAction: Creators.getMovies,
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible,
  addMovieToFavoritesStartAction: Creators.addMovieToFavoritesStart,
  enableSwipeAction: NavActionCreators.enableSwipe,
  getFavoritesAction: Creators.getFavoriteMovies
};

const enhance = compose(connect(mapStateToProps, actions), withTheme, withLoader);

export default enhance(Container);
