/* eslint-disable react/prop-types */

import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import ScreenContainer from 'components/screen-container.component';
import ContentWrap from 'components/content-wrap.component';
import Icon from 'components/icon/icon.component';
import { createFontFormat } from 'utils';
import MusicPlayerSlider from './music-player-slider.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/music/music.actions';
import withLoader from 'components/with-loader.component';
import { createStructuredSelector } from 'reselect';
import {
  selectNowPlaying,
  selectPaused,
  selectPlaylist,
  selectShuffle,
  selectRepeat
} from 'modules/ducks/music/music.selectors';

const coverplaceholder = require('assets/imusic-placeholder.png');

const MusicPlayerScreen = ({
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
  repeat
}) => {
  const theme = useTheme();
  const [disablePrevious, setDisablePrevious] = React.useState(true);
  const [disableNext, setDisableNext] = React.useState(false);

  React.useEffect(() => {
    setNowPlayingBackgroundModeAction(true);

    updateButtons(nowPlaying);

    // Unsubscribe
    return () => setNowPlayingBackgroundModeAction(false);
  }, []);

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

  const getRepeatColor = () => {
    if (repeat.order !== 1) return theme.iplayya.colors.vibrantpussy;

    /// normal color
    return 'white';
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

        <MusicPlayerSlider />

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Pressable style={{ marginRight: 20 }} onPress={() => toggleShuffleAction()}>
            <Icon
              name="shuffle"
              size={24}
              style={{
                color: isShuffled ? theme.iplayya.colors.vibrantpussy : 'white'
              }}
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
          <Pressable
            style={{ marginLeft: 20, position: 'relative' }}
            onPress={() => cycleRepeatAction()}
          >
            <Icon name="repeat" size={24} style={{ color: getRepeatColor() }} />
            <Text
              style={{
                position: 'absolute',
                top: 0,
                right: -8,
                fontWeight: 'bold',
                color: getRepeatColor(),
                opacity: repeat.order === 3 ? 1 : 0
              }}
            >
              1
            </Text>
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
  toggleShuffleAction: Creators.toggleShuffle,
  setShuffleOffAction: Creators.setShuffleOff,
  cycleRepeatAction: Creators.cycleRepeat
};

const mapStateToProps = createStructuredSelector({
  playlist: selectPlaylist,
  paused: selectPaused,
  nowPlaying: selectNowPlaying,
  isShuffled: selectShuffle,
  repeat: selectRepeat
});

const enhance = compose(connect(mapStateToProps, actions), withLoader);

export default enhance(Container);
