/* eslint-disable react/prop-types */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withTheme, ActivityIndicator } from 'react-native-paper';
// import { Text, Banner, withTheme, ActivityIndicator } from 'react-native-paper';
import Spacer from 'components/spacer.component';
import ScreenContainer from 'components/screen-container.component';
import withLoader from 'components/with-loader.component';
import ImusicBottomTabs from './imusic-bottom-tabs.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators as AppActionCreators } from 'modules/app';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import { Creators } from 'modules/ducks/music/music.actions';
// import Icon from 'components/icon/icon.component';
import {
  selectError,
  selectIsFetching,
  selectAlbums,
  selectPaginatorInfo,
  selectGenrePaginator
} from 'modules/ducks/music/music.selectors';
import GenreScroll from './genre-scroll.component';
import { FlatList } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';

const ImusicScreen = ({
  navigation,
  // error,
  getAlbumsAction,
  paginatorInfo,
  // theme,
  genrePaginator,
  albums,
  enableSwipeAction,
  setNetworkInfoAction,
  resetGenrePaginatorAction,
  setNowPlayingBackgroundModeAction,
  switchInImusicScreenAction
}) => {
  const isFocused = useIsFocused();
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = React.useState(
    true
  );
  const [scrollIndex] = React.useState(0);
  // const [showBanner, setShowBanner] = React.useState(true);

  // React.useEffect(() => {
  //   switchInImusicScreenAction(true);
  // });

  React.useEffect(() => {
    setNowPlayingBackgroundModeAction(false);

    resetGenrePaginatorAction();
    enableSwipeAction(false);

    // Subscribe to network changes
    const unsubscribe = NetInfo.addEventListener(({ type, isConnected }) => {
      setNetworkInfoAction({ type, isConnected });
    });

    // Unsubscribe
    return () => {
      unsubscribe();
      setNowPlayingBackgroundModeAction(true);

      switchInImusicScreenAction(false);
    };
  }, []);

  React.useEffect(() => {
    if (isFocused) {
      switchInImusicScreenAction(true);
    } else {
      switchInImusicScreenAction(false);
    }
  }, [isFocused]);

  /// for development
  React.useEffect(() => {
    if (!albums.length) console.log('Something went wrong, albums array empty');
  }, [albums]);

  React.useEffect(() => {
    if (paginatorInfo.length) {
      getAlbumsAction(paginatorInfo, { page: 1, limit: 10 });
    }
  }, [paginatorInfo]);

  const handleSelect = (album) => {
    // console.log('x');
    navigation.navigate('AlbumDetailScreen', { albumId: album.id });
  };

  const renderEmpty = () => {
    return <ActivityIndicator />;
  };

  // const handleRetry = () => {
  //   if (paginatorInfo.length) {
  //     getAlbumsAction(paginatorInfo, genrePaginator);
  //   }
  //   setShowBanner(false);
  // };

  // // show error banner on error
  // React.useEffect(() => {
  //   if (error) {
  //     setShowBanner(true);
  //   }
  // }, [error]);

  // const renderErrorBanner = () => {
  //   if (!error) return;

  //   return (
  //     <Banner
  //       visible={showBanner}
  //       actions={[
  //         {
  //           label: 'Retry',
  //           onPress: () => handleRetry()
  //         }
  //       ]}
  //       icon={({ size }) => (
  //         <Icon name="alert" size={size} color={theme.iplayya.colors.vibrantpussy} />
  //       )}
  //     >
  //       <Text style={{ color: 'black' }}>{error}</Text>
  //     </Banner>
  //   );
  // };

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
      {/* {renderErrorBanner()} */}
      {albums.length ? (
        <React.Fragment>
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
          {renderEmpty()}
          <Spacer size={100} />
        </View>
      )}

      <ImusicBottomTabs navigation={navigation} />
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
  setNowPlayingBackgroundModeAction: Creators.setNowPlayingBackgroundMode,
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible,
  addMovieToFavoritesStartAction: Creators.addMovieToFavoritesStart,
  enableSwipeAction: NavActionCreators.enableSwipe,
  resetGenrePaginatorAction: Creators.resetGenrePaginator,
  switchInImusicScreenAction: Creators.switchInImusicScreen
};

const enhance = compose(connect(mapStateToProps, actions), withTheme, withLoader);

export default enhance(Container);
