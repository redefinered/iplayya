/* eslint-disable react/prop-types */

import React from 'react';
import { View, Image } from 'react-native';
import { Text } from 'react-native-paper';
import ScreenContainer from 'components/screen-container.component';
import ContentWrap from 'components/content-wrap.component';
import { createFontFormat } from 'utils';
import MusicPlayerSlider from './music-player-slider.component';
import SnackBar from 'components/snackbar/snackbar.component';
import withLoader from 'components/with-loader.component';
import ShuffleButton from 'components/button-shuffle/shuffle-button.component';
import PrevButton from 'components/button-prev/prev-button.component';
import NextButton from 'components/button-next/next-button.component';
import RepeatButton from 'components/button-repeat/repeat-button.component';
import PlayButton from 'components/button-play/play-button.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/music/music.actions';
import { Creators as FavoritesCreators } from 'modules/ducks/imusic-favorites/imusic-favorites.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectNowPlaying,
  selectPaused,
  selectPlaylist,
  selectShuffle,
  selectRepeat,
  selectAlbumId,
  selectTrack
} from 'modules/ducks/music/music.selectors';
import { selectUpdated } from 'modules/ducks/imusic-favorites/imusic-favorites.selectors';
import theme from 'common/theme';
import withNotifRedirect from 'components/with-notif-redirect.component';

const coverplaceholder = require('assets/imusic-placeholder.png');

const MusicPlayerScreen = ({
  navigation,
  playlist,
  nowPlaying,
  setNowPlayingAction,
  setProgressAction,
  setNowPlayingBackgroundModeAction,
  paused,
  setPausedAction,
  isShuffled,
  toggleShuffleAction,
  cycleRepeatAction,
  repeat,
  getAlbumDetailsAction,
  albumId,
  track,
  updated,
  favoritesStartAction
}) => {
  const [disablePrevious, setDisablePrevious] = React.useState(true);
  const [disableNext, setDisableNext] = React.useState(false);
  const [showUpdateNotification, setShowUpdateNotification] = React.useState(false);

  React.useEffect(() => {
    setNowPlayingBackgroundModeAction(true);

    updateButtons(nowPlaying);

    /// set track as navigation parameter for use of the add to favorites button
    navigation.setParams({ track });

    // Unsubscribe
    return () => {
      // setNowPlayingBackgroundModeAction(false);

      getAlbumDetailsAction(albumId);
    };
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setNowPlayingBackgroundModeAction(false);
    });

    return unsubscribe;
  }, [navigation]);

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

  React.useEffect(() => {
    updateButtons(nowPlaying);

    navigation.setParams({ track });
  }, [nowPlaying]);

  const hideUpdateNotification = () => {
    /// reset updated check
    favoritesStartAction();

    setTimeout(() => {
      setShowUpdateNotification(false);
    }, 3000);
  };

  const renderUpdateNotification = () => {
    if (!track) return;

    return (
      <SnackBar
        visible={showUpdateNotification}
        message={`${track.name} is added to your favorites list`}
        iconName="heart-solid"
        iconColor={theme.iplayya.colors.vibrantpussy}
      />
    );
  };

  const updateButtons = (nowPlaying) => {
    setProgressAction(0);

    if (nowPlaying) {
      const { sequence } = nowPlaying;
      const nextSequence = sequence + 1;
      const previousSequence = sequence - 1;
      const totalTracks = playlist.length;

      setDisableNext(false);
      setDisablePrevious(false);

      if (nextSequence > totalTracks) {
        setDisableNext(true);
      }

      if (previousSequence < 1) {
        setDisablePrevious(true);
      }
    }
  };

  const playNext = () => {
    /// set now playing to the next item in the selected album
    const nextTrackNumber = nowPlaying.sequence + 1;

    /// if next track does not exist, stop
    if (nextTrackNumber > playlist.length) {
      setDisablePrevious(false);

      // reset progress
      setProgressAction(0);

      // turn playing off
      setPausedAction(true);

      // setNowPlayingAction(null);

      return;
    }

    const nextTrack = playlist.find(({ sequence }) => nextTrackNumber === parseInt(sequence));

    const { number, sequence, name: title, url: source, performer: artist } = nextTrack;
    setNowPlayingAction(
      {
        number: parseInt(number),
        sequence: parseInt(sequence),
        title,
        artist,
        source,
        thumbnail: coverplaceholder
      },
      false
    );
  };

  const handleTogglePlayAction = () => {
    setPausedAction(!paused);
  };

  const playPrevious = () => {
    /// set now playing to the next item in the selected album
    const nextTrackNumber = nowPlaying.sequence - 1;

    /// if next track does not exist, stop
    if (nextTrackNumber <= 0) {
      // reset progress
      setProgressAction(0);

      // turn playing off
      setPausedAction(true);

      // setNowPlayingAction(null);

      return;
    }

    const nextTrack = playlist.find(({ sequence }) => nextTrackNumber === parseInt(sequence));

    const { number, sequence, name: title, url: source, performer: artist } = nextTrack;
    setNowPlayingAction(
      {
        number: parseInt(number),
        sequence: parseInt(sequence),
        title,
        artist,
        source,
        thumbnail: coverplaceholder
      },
      false
    );
  };

  if (nowPlaying) {
    const { name, performer } = nowPlaying;
    return (
      <ContentWrap>
        <View style={{ alignItems: 'center', paddingTop: 70, marginBottom: 30 }}>
          <Image style={{ width: 220, height: 220, borderRadius: 8 }} source={coverplaceholder} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View style={{ marginBottom: 30 }}>
            <Text
              numberOfLines={2}
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                marginBottom: 15,
                ...createFontFormat(20, 27)
              }}
            >
              {name}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                textAlign: 'center',
                color: theme.iplayya.colors.vibrantpussy,
                ...createFontFormat(16, 22)
              }}
            >
              {performer}
            </Text>
          </View>
        </View>

        <MusicPlayerSlider />

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <ShuffleButton active={isShuffled} pressAction={toggleShuffleAction} />
          <PrevButton pressAction={playPrevious} disabled={disablePrevious} />
          <PlayButton paused={paused} pressAction={handleTogglePlayAction} />
          <NextButton pressAction={playNext} disabled={disableNext} />
          <RepeatButton repeat={repeat} pressAction={cycleRepeatAction} />
        </View>

        {renderUpdateNotification()}
      </ContentWrap>
    );
  }

  return <View />;
};

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <MusicPlayerScreen {...props} />
  </ScreenContainer>
);

const actions = {
  favoritesStartAction: FavoritesCreators.start,
  setNowPlayingBackgroundModeAction: Creators.setNowPlayingBackgroundMode,
  getAlbumDetailsAction: Creators.getAlbumDetails,
  setPausedAction: Creators.setPaused,
  setProgressAction: Creators.setProgress,
  setNowPlayingAction: Creators.setNowPlaying,
  toggleShuffleAction: Creators.toggleShuffle,
  setShuffleOffAction: Creators.setShuffleOff,
  cycleRepeatAction: Creators.cycleRepeat
};

const mapStateToProps = createStructuredSelector({
  track: selectTrack,
  albumId: selectAlbumId,
  playlist: selectPlaylist,
  paused: selectPaused,
  updated: selectUpdated,
  nowPlaying: selectNowPlaying,
  isShuffled: selectShuffle,
  repeat: selectRepeat
});

const enhance = compose(connect(mapStateToProps, actions), withLoader, withNotifRedirect);

export default enhance(Container);
