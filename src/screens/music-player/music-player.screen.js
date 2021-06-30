/* eslint-disable react/prop-types */

import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import ScreenContainer from 'components/screen-container.component';
import ContentWrap from 'components/content-wrap.component';
import Icon from 'components/icon/icon.component';
import Slider from '@react-native-community/slider';
import { createFontFormat, toDateTime } from 'utils';
import thumbImage from 'assets/player-thumb-image.png';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/music/music.actions';
import withLoader from 'components/with-loader.component';
import { createStructuredSelector } from 'reselect';
import {
  selectNowPlaying,
  selectPlaybackProgress,
  selectPaused,
  selectPlaybackInfo,
  selectPlaylist,
  selectShuffle
} from 'modules/ducks/music/music.selectors';

import moment from 'moment';

const coverplaceholder = require('assets/imusic-placeholder.png');

const MusicPlayerScreen = ({
  playlist,
  nowPlaying,
  setNowPlayingAction,
  progress,
  setProgressAction,
  setNowPlayingBackgroundModeAction,
  paused,
  setPausedAction,
  playbackInfo,
  isShuffled
}) => {
  const theme = useTheme();
  const [remainingTime, setRemainingTime] = React.useState(0);
  const [disablePrevious, setDisablePrevious] = React.useState(true);
  const [disableNext, setDisableNext] = React.useState(false);

  React.useEffect(() => {
    setNowPlayingBackgroundModeAction(true);

    updateButtons(nowPlaying);

    // Unsubscribe
    return () => setNowPlayingBackgroundModeAction(false);
  }, []);

  // const { title, artist, thumbnails } = dummydata.find((item) => item.id === id);

  React.useEffect(() => {
    if (!playbackInfo) return setRemainingTime(0);

    const { seekableDuration, currentTime } = playbackInfo;
    const remainingTime = seekableDuration - currentTime;

    setRemainingTime(remainingTime);
  }, [playbackInfo]);

  React.useEffect(() => {
    updateButtons(nowPlaying);
  }, [nowPlaying]);

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

  const renderDuration = () => {
    const { currentTime } = playbackInfo;
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
        <Text style={{ ...createFontFormat(10, 14) }}>
          {moment(toDateTime(currentTime)).format('mm:ss')}
        </Text>
        <Text style={{ ...createFontFormat(10, 14) }}>
          -{moment(toDateTime(remainingTime)).format('mm:ss')}
        </Text>
      </View>
    );
  };

  // console.log({ disableNext, disablePrevious });

  if (nowPlaying) {
    const { name, performer } = nowPlaying;
    return (
      <ContentWrap>
        <View style={{ alignItems: 'center', paddingTop: 70, marginBottom: 30 }}>
          <Image style={{ width: 220, height: 220, borderRadius: 8 }} source={coverplaceholder} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ marginBottom: 30 }}>
            <Text
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
        <Slider
          value={progress}
          style={{ width: '100%', height: 10 }}
          minimumValue={0}
          maximumValue={100}
          minimumTrackTintColor={theme.iplayya.colors.vibrantpussy}
          maximumTrackTintColor="white"
          thumbImage={thumbImage}
        />

        {renderDuration()}

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Pressable style={{ marginRight: 20 }}>
            <Icon
              name="shuffle"
              size={24}
              style={{ color: isShuffled ? 'white' : theme.iplayya.colors.white50 }}
            />
          </Pressable>
          <Pressable onPress={playPrevious} disabled={disablePrevious}>
            <Icon
              name="previous"
              size={40}
              style={{ color: disablePrevious ? theme.iplayya.colors.white25 : 'white' }}
            />
          </Pressable>
          <Pressable onPress={() => setPausedAction(!paused)}>
            <Icon
              name={paused ? 'circular-play' : 'circular-pause'}
              size={80}
              style={{ marginHorizontal: 20 }}
            />
          </Pressable>
          <Pressable onPress={playNext} disabled={disableNext}>
            <Icon
              name="next"
              size={40}
              style={{ color: disableNext ? theme.iplayya.colors.white25 : 'white' }}
            />
          </Pressable>
          <Pressable style={{ marginLeft: 20 }}>
            <Icon name="repeat" size={24} style={{ color: theme.iplayya.colors.white50 }} />
          </Pressable>
        </View>
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
  setNowPlayingBackgroundModeAction: Creators.setNowPlayingBackgroundMode,
  setPausedAction: Creators.setPaused,
  setProgressAction: Creators.setProgress,
  setNowPlayingAction: Creators.setNowPlaying,
  setShuffleOffAction: Creators.setShuffleOff
};

const mapStateToProps = createStructuredSelector({
  playlist: selectPlaylist,
  paused: selectPaused,
  nowPlaying: selectNowPlaying,
  progress: selectPlaybackProgress,
  playbackInfo: selectPlaybackInfo,
  isShuffled: selectShuffle
});

const enhance = compose(connect(mapStateToProps, actions), withLoader);

export default enhance(Container);
