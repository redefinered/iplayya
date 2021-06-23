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
import { Creators as AppActionCreators } from 'modules/app';
import { Creators as AuthActionCreators } from 'modules/ducks/auth/auth.actions';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import { Creators } from 'modules/ducks/music/music.actions';
import Icon from 'components/icon/icon.component';
import {
  selectError,
  selectIsFetching,
  selectAlbums,
  // selectCategoriesOf,
  selectPaginatorInfo,
  selectGenrePaginator
} from 'modules/ducks/music/music.selectors';
import { urlEncodeTitle } from 'utils';
import GenreScroll from './genre-scroll.component';
import { FlatList } from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';
// import { selectAlbums } from 'modules/ducks/music/music.selectors';

// const coverplaceholder = require('assets/imusic-placeholder.png');

const ImusicScreen = ({
  isFetching,
  navigation,
  error,
  getAlbumsAction,
  getAlbumAction,
  paginatorInfo,
  addMovieToFavoritesStartAction,
  theme,
  route: { params },
  genrePaginator,
  albums,
  enableSwipeAction,
  setNetworkInfoAction,
  resetGenrePaginatorAction
}) => {
  // console.log({ albums });
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = React.useState(
    true
  );
  const [scrollIndex, setScrollIndex] = React.useState(0);
  const [showBanner, setShowBanner] = React.useState(true);

  React.useEffect(() => {
    resetGenrePaginatorAction();
    enableSwipeAction(false);

    // Subscribe to network changes
    const unsubscribe = NetInfo.addEventListener(({ type, isConnected }) => {
      setNetworkInfoAction({ type, isConnected });
    });

    // Unsubscribe
    return () => unsubscribe();
  }, []);

  // React.useEffect(() => {
  //   console.log({ albums });
  //   let collection = [];
  //   if (typeof albums === 'undefined') return setData(collection);

  //   collection = albums.map((props) => {
  //     return { cover: coverplaceholder, ...props };
  //   });

  //   return setData(collection);
  // }, [albums]);

  // React.useEffect(() => {
  //   // console.log({ data, albums });
  //   if (typeof params !== 'undefined') {
  //     const { categoryName } = params;
  //     return setScrollIndex(data.findIndex((c) => c.category === categoryName));
  //   }
  //   setScrollIndex(0);
  // }, [params, data]);

  // get movies on mount
  React.useEffect(() => {
    if (paginatorInfo.length) {
      getAlbumsAction(paginatorInfo, { page: 1, limit: 10 });
    }
  }, [paginatorInfo]);

  const handleSelect = (album) => {
    // console.log(album);
    navigation.navigate('AlbumDetailScreen', { album });
    // getAlbumAction(id);
    // if (is_series) return navigation.navigate('SeriesDetailScreen', { videoId });
    // navigation.navigate('MovieDetailScreen', { videoId }); // set to true temporarily
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

  const renderItem = ({ item: { genre } }) => {
    if (typeof albums === 'undefined') return;

    return <GenreScroll genre={genre} onSelect={handleSelect} />;
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
      {albums.length ? (
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
            data={albums}
            keyExtractor={(album) => album.id}
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
  albums: selectAlbums,
  paginatorInfo: selectPaginatorInfo,
  genrePaginator: selectGenrePaginator
});

const actions = {
  setNetworkInfoAction: AppActionCreators.setNetworkInfo,
  getAlbumsAction: Creators.getAlbums,
  getAlbumAction: Creators.getAlbum,
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible,
  addMovieToFavoritesStartAction: Creators.addMovieToFavoritesStart,
  enableSwipeAction: NavActionCreators.enableSwipe,
  resetGenrePaginatorAction: Creators.resetGenrePaginator
};

const enhance = compose(connect(mapStateToProps, actions), withTheme, withLoader);

export default enhance(Container);
