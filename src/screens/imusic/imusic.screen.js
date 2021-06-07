/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Banner, withTheme } from 'react-native-paper';
import Spacer from 'components/spacer.component';
import ScreenContainer from 'components/screen-container.component';
import withLoader from 'components/with-loader.component';
import ImovieBottomTabs from './imusic-bottom-tabs.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators as AuthActionCreators } from 'modules/ducks/auth/auth.actions';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import { Creators } from 'modules/ducks/music/music.actions';
import Icon from 'components/icon/icon.component';
import {
  selectError,
  selectIsFetching,
  // selectMovies,
  // selectCategoriesOf,
  selectPaginatorInfo,
  selectGenrePaginator
} from 'modules/ducks/music/music.selectors';
import { urlEncodeTitle } from 'utils';
import CategoryScroll from 'components/category-scroll/category-scroll.component';
import { FlatList } from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';

const ImusicScreen = ({
  isFetching,
  navigation,
  error,
  getAlbumsAction,
  paginatorInfo,
  addMovieToFavoritesStartAction,
  theme,
  route: { params },
  genrePaginator,
  movies,
  enableSwipeAction,
  setNetworkInfoAction
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

  // React.useEffect(() => {
  //   addMovieToFavoritesStartAction();
  //   enableSwipeAction(false);

  //   // Subscribe to network changes
  //   const unsubscribe = NetInfo.addEventListener(({ type, isConnected }) => {
  //     setNetworkInfoAction({ type, isConnected });
  //   });

  //   // Unsubscribe to network changes
  //   unsubscribe();
  // }, []);

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
      getAlbumsAction(paginatorInfo, genrePaginator);
    }
  }, [paginatorInfo]);

  const handleMovieSelect = ({ id: videoId, is_series }) => {
    if (is_series) return navigation.navigate('SeriesDetailScreen', { videoId });
    navigation.navigate('MovieDetailScreen', { videoId }); // set to true temporarily
  };

  const renderEmpty = () => {
    return <Text>No music found</Text>;
  };

  const handleRetry = () => {
    if (paginatorInfo.length) {
      getAlbumsAction(paginatorInfo, genrePaginator);
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

  const renderItem = ({ item: { category } }) => {
    if (typeof movies === 'undefined') return;

    return <CategoryScroll datatype="music" category={category} onSelect={handleMovieSelect} />;
  };

  const handleEndReached = (info) => {
    if (!onEndReachedCalledDuringMomentum) {
      console.log('end reached!', info);
      getAlbumsAction(paginatorInfo, genrePaginator);
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
          <Spacer size={70} />
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
    <ImusicScreen {...props} />
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
  // movies: selectMovies,
  paginatorInfo: selectPaginatorInfo,
  genrePaginator: selectGenrePaginator
  // categories: selectCategoriesOf('movies')
});

const actions = {
  setNetworkInfoAction: AuthActionCreators.setNetworkInfo,
  getAlbumsAction: Creators.getAlbums,
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible,
  addMovieToFavoritesStartAction: Creators.addMovieToFavoritesStart,
  enableSwipeAction: NavActionCreators.enableSwipe
};

const enhance = compose(connect(mapStateToProps, actions), withTheme, withLoader);

export default enhance(Container);
