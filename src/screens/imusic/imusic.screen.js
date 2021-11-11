/* eslint-disable react/prop-types */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withTheme, ActivityIndicator } from 'react-native-paper';
import Spacer from 'components/spacer.component';
import ScreenContainer from 'components/screen-container.component';
import ImusicBottomTabs from './imusic-bottom-tabs.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators as AppActionCreators } from 'modules/app';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import { Creators } from 'modules/ducks/music/music.actions';
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
import theme from 'common/theme';

const CARD_DIMENSIONS = { WIDTH: 148, HEIGHT: 148 };

const ImusicScreen = ({
  isFetching,
  navigation,
  getAlbumsAction,
  paginatorInfo,
  genrePaginator,
  albums,
  enableSwipeAction,
  setNetworkInfoAction,
  resetGenrePaginatorAction,
  setNowPlayingBackgroundModeAction,
  switchInImusicScreenAction
}) => {
  const brand = theme.iplayya.colors;

  const isFocused = useIsFocused();
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = React.useState(
    true
  );
  const [scrollIndex] = React.useState(0);
  const [bottomPadding, setBottomPadding] = React.useState(null);

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

  const handleBottomTabsLayoutEvent = ({ nativeEvent }) => {
    const {
      layout: { height }
    } = nativeEvent;

    setBottomPadding(height);
  };

  const renderListFooter = () => {
    if (!isFetching) return;

    return (
      <View
        style={{
          width: CARD_DIMENSIONS.WIDTH,
          height: CARD_DIMENSIONS.HEIGHT,
          borderRadius: 8,
          backgroundColor: brand.white10,
          justifyContent: 'center',
          marginLeft: theme.spacing(2)
        }}
      >
        <ActivityIndicator />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={albums}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        initialScrollIndex={scrollIndex}
        onEndReached={(info) => handleEndReached(info)}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
        ListFooterComponent={renderListFooter()}
      />

      <Spacer size={bottomPadding} />

      <ImusicBottomTabs handleBottomTabsLayoutEvent={handleBottomTabsLayoutEvent} />
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

const enhance = compose(connect(mapStateToProps, actions), withTheme);

export default enhance(Container);
