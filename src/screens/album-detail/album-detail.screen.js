/* eslint-disable react/prop-types */

import React from 'react';
import { StyleSheet, View, Image, FlatList } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import Button from 'components/button/button.component';
import ScreenContainer from 'components/screen-container.component';
import withLoader from 'components/with-loader.component';
import ContentWrap from 'components/content-wrap.component';
import ActionSheet from 'components/action-sheet/action-sheet.component';
import Icon from 'components/icon/icon.component';
import SnackBar from 'components/snackbar/snackbar.component';
import MoreButton from 'components/button-more/more-button.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/music/music.actions';
import { Creators as FavoritesCreators } from 'modules/ducks/imusic-favorites/imusic-favorites.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectIsFetching,
  selectAlbum,
  selectNowPlaying,
  selectIsBackgroundMode,
  selectNowPlayingLayoutInfo
} from 'modules/ducks/music/music.selectors';
import { selectUpdated } from 'modules/ducks/imusic-favorites/imusic-favorites.selectors';
import theme from 'common/theme';

const coverplaceholder = require('assets/imusic-placeholder.png');

const ITEM_HEIGHT = 64;

const styles = StyleSheet.create({
  root: { flex: 1, marginTop: theme.spacing(2) },
  cover: {
    width: 148,
    height: 148,
    borderRadius: 8
  },
  albumName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  artist: {
    fontSize: 16
  }
});

const AlbumDetail = ({
  navigation,
  favoritesStartAction,
  route,
  album,
  updated,
  getAlbumDetailsStartAction,
  isBackgroundMode,
  setNowPlayingAction,
  nowPlaying,
  nowPlayingLayoutInfo,
  setShuffleOnAction,
  setShuffleOffAction,
  setProgressAction,
  setPausedAction,
  clearRepeatAction,
  addTrackToFavoritesAction,
  getAlbumDetailsAction
}) => {
  const { albumId } = route.params;
  const [showActionSheet, setShowActionSheet] = React.useState(false);
  const [selectedTrack, setSelectedTrack] = React.useState(null);
  const [showUpdateNotification, setShowUpdateNotification] = React.useState(false);

  React.useEffect(() => {
    getAlbumDetailsAction(albumId);
    /// clean up
    return () => getAlbumDetailsStartAction();
  }, []);

  React.useEffect(() => {
    if (!album) return;

    navigation.setParams({ album });
  }, [album]);

  /// show update notification
  React.useEffect(() => {
    if (updated) {
      setShowUpdateNotification(true);
    }
  }, [updated]);

  /// hide update notification when it displays
  React.useEffect(() => {
    if (showUpdateNotification) {
      hideUpdateNotification();
    }
  }, [showUpdateNotification]);

  const hideActionSheet = () => {
    setShowActionSheet(false);
  };

  const handleSelectItem = (item) => {
    clearRepeatAction();

    setShuffleOffAction();

    const { number, name: title, url: source, performer: artist } = item;

    setProgressAction(0);

    setNowPlayingAction(
      {
        number: parseInt(number),
        title,
        artist,
        source,
        thumbnail: coverplaceholder
      },
      true
    );
  };

  const renderBottomPadding = () => {
    if (isBackgroundMode) return;
    if (!nowPlayingLayoutInfo) return;
    if (!nowPlaying) return;

    return (
      <View style={{ width: nowPlayingLayoutInfo.width, height: nowPlayingLayoutInfo.height }} />
    );
  };

  const handleShufflePlay = () => {
    clearRepeatAction();

    setPausedAction(false);
    setShuffleOnAction();

    setNowPlayingAction(null, true); // select a random track from album
  };

  const handlePressAction = (data) => {
    setSelectedTrack(data);
    setShowActionSheet(true);
  };

  const handleAddToFacoritesPress = () => {
    if (!selectedTrack) return;

    addTrackToFavoritesAction(selectedTrack.id);

    hideActionSheet();
  };

  const handleDownloadItem = () => {
    console.log('download item');
    hideActionSheet();
  };

  const actions = [
    {
      icon: 'heart-solid',
      title: 'Add to favorites',
      onPress: handleAddToFacoritesPress
    },
    {
      icon: 'download',
      title: 'Download',
      onPress: handleDownloadItem
    }
  ];

  const hideUpdateNotification = () => {
    /// reset updated check
    favoritesStartAction();

    setTimeout(() => {
      setShowUpdateNotification(false);
    }, 3000);
  };

  if (!album) return <View />;

  const renderItem = ({ item: { name, ...rest } }) => (
    <TouchableRipple onPress={() => handleSelectItem({ ...rest, name })}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: theme.spacing(2),
          paddingVertical: theme.spacing(1)
        }}
      >
        <Image source={coverplaceholder} style={{ width: 40, height: 40 }} />
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            paddingVertical: 3,
            paddingLeft: theme.spacing(1),
            paddingRight: 5
          }}
        >
          <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 14 }}>
            {name}
          </Text>
          <Text style={{ fontSize: 12, color: theme.iplayya.colors.white50 }}>
            {`${album.performer} • 4:04 min`}
          </Text>
        </View>
        <MoreButton pressAction={handlePressAction} data={{ name, ...rest }} />
      </View>
    </TouchableRipple>
  );

  const renderUpdateNotification = () => {
    if (route.name !== 'MusicPlayerScreen') return;
    if (!album) return;

    return (
      <SnackBar
        visible={showUpdateNotification}
        message={`${album.name} is added to your favorites list`}
        iconName="heart-solid"
        iconColor={theme.iplayya.colors.vibrantpussy}
      />
    );
  };

  const renderPrograms = () => {
    if (typeof album.tracks === 'undefined') return;

    return (
      <View style={{ flex: 1, paddingVertical: theme.spacing(1) }}>
        <FlatList
          bounces={false}
          data={album.tracks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          getItemLayout={(data, index) => {
            return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
          }}
        />
        {renderBottomPadding()}
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <ContentWrap style={{ flexDirection: 'row', marginBottom: theme.spacing(2) }}>
        <Image style={styles.cover} source={coverplaceholder} />
        <View style={{ flex: 1, paddingLeft: theme.spacing(2), justifyContent: 'space-between' }}>
          <View style={{ marginTop: theme.spacing(1) }}>
            <Text style={{ marginBottom: theme.spacing(1), ...styles.albumName }}>
              {album.name}
            </Text>
            <Text style={{ color: theme.iplayya.colors.vibrantpussy, ...styles.artist }}>
              {album.performer}
            </Text>
          </View>
          <View style={{ marginBottom: theme.spacing(1) }}>
            <Text style={{ fontSize: 14, color: theme.iplayya.colors.white50 }}>
              {`${album.tracks.length} Songs • 56:07 min`}
            </Text>
            <Text
              style={{ fontSize: 14, color: theme.iplayya.colors.white50 }}
            >{`Released ${album.year}`}</Text>
          </View>
        </View>
      </ContentWrap>

      <ContentWrap style={{ marginBottom: theme.spacing(2) }}>
        <Button mode="contained" onPress={handleShufflePlay}>
          <Icon name="shuffle" size={theme.iconSize(3)} />
          <View style={{ width: theme.spacing(1) }} />
          <Text style={{ fontWeight: 'bold' }}>Shuffle Play</Text>
        </Button>
      </ContentWrap>

      {renderPrograms()}
      <ActionSheet visible={showActionSheet} actions={actions} hideAction={hideActionSheet} />

      {renderUpdateNotification()}
    </View>
  );
};

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <AlbumDetail {...props} />
  </ScreenContainer>
);

const actions = {
  favoritesStartAction: FavoritesCreators.start,
  getAlbumDetailsStartAction: Creators.getAlbumDetailsStart,
  getAlbumDetailsAction: Creators.getAlbumDetails,
  setNowPlayingAction: Creators.setNowPlaying,
  setPausedAction: Creators.setPaused,
  setShuffleOnAction: Creators.setShuffleOn,
  setShuffleOffAction: Creators.setShuffleOff,
  setProgressAction: Creators.setProgress,
  clearRepeatAction: Creators.clearRepeat,
  addTrackToFavoritesAction: FavoritesCreators.addTrackToFavorites,
  addAlbumToFavoritesStartAction: FavoritesCreators.addAlbumToFavoritesStart
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  album: selectAlbum,
  updated: selectUpdated,
  nowPlaying: selectNowPlaying,
  isBackgroundMode: selectIsBackgroundMode,
  nowPlayingLayoutInfo: selectNowPlayingLayoutInfo
});

const enhance = compose(connect(mapStateToProps, actions), withLoader);

export default enhance(Container);
