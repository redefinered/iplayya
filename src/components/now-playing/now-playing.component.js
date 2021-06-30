import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, Pressable, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import Video from 'react-native-video';
import PlayingAnimationPlaceholder from 'assets/animation-placeholder.svg';
import PausedAnimationPlaceholder from 'assets/paused-animation-placeholder.svg';
import { createFontFormat } from 'utils';
import {
  selectNowPlaying,
  selectIsBackgroundMode,
  selectAlbum,
  selectPlaylist,
  selectPaused,
  selectPlaybackProgress
} from 'modules/ducks/music/music.selectors';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/music/music.actions';
import { createStructuredSelector } from 'reselect';
import DeviceInfo from 'react-native-device-info';
import clone from 'lodash/clone';

const coverplaceholder = require('assets/imusic-placeholder.png');

const NowPlaying = ({
  // eslint-disable-next-line react/prop-types
  navigation,
  nowPlaying,
  playlist,
  progress,
  setProgressAction,
  setNowPlayingAction,
  isBackgroundMode,
  setNowPlayingLayoutInfoAction,
  updatePlaybackInfoAction,
  paused,
  setPausedAction
}) => {
  const theme = useTheme();
  const rootComponent = React.useRef();

  const [buffering, setBuffering] = React.useState(false);
  const [playbackInfo, setPlaybackInfo] = React.useState(null);
  const [hasNotch, setHasNotch] = React.useState(false);

  React.useEffect(() => {
    /// shows the bottom padding for devices with notch. not yet fully tested
    if (DeviceInfo.hasNotch()) setHasNotch(true);
  }, []);

  React.useEffect(() => {
    if (playbackInfo) {
      updatePlaybackInfoAction(playbackInfo);

      const { seekableDuration, currentTime } = playbackInfo;

      let percentage = (currentTime / seekableDuration) * 100;

      percentage = percentage === Infinity ? 0 : percentage;
      percentage = isNaN(percentage) ? 0 : percentage;
      setProgressAction(percentage);

      if (Math.ceil(percentage) === 100) playNext();
    }
  }, [playbackInfo]);

  const playNext = () => {
    /// set now playing to the next item in the selected album
    const nextTrackNumber = nowPlaying.sequence + 1;

    /// if next track does not exist, stop
    if (nextTrackNumber > playlist.length) {
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

  React.useEffect(() => {
    if (nowPlaying) {
      if (playbackInfo) {
        // hack playbackInfo because it does not reset when music stops
        const previousPlaybackInfo = clone(playbackInfo);
        setPlaybackInfo(
          Object.assign(previousPlaybackInfo, { currentTime: 0, seekableDuration: 0 })
        );
      }

      const { source } = nowPlaying;
      if (!source) return;

      setPausedAction(false);
    }
  }, [nowPlaying]);

  const handleBuffer = () => {
    console.log('buffering...');
    setBuffering(true);
  };

  const handleError = () => {
    console.log('source error');
  };

  const handleProgress = (progressInfo) => {
    setPlaybackInfo(progressInfo);
    setBuffering(false);
  };

  const renderThumbnail = (nowPlaying) => {
    const { thumbnail } = nowPlaying;
    if (typeof thumbnail !== 'undefined')
      return (
        <Image
          style={{ width: 60, height: 60, borderRadius: 8, marginRight: 15 }}
          source={thumbnail}
        />
      );
  };

  const renderContent = (nowPlaying) => {
    const { name: title, performer: artist } = nowPlaying;

    if (artist)
      return (
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{ fontWeight: 'bold', marginBottom: 5, ...createFontFormat(12, 16) }}
          >
            {buffering ? 'Buffering...' : title}
          </Text>
          <Text style={{ ...createFontFormat(12, 16) }}>{artist}</Text>
        </View>
      );

    return (
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={{ fontWeight: 'bold', marginBottom: 5, ...createFontFormat(12, 16) }}
        >
          {buffering ? 'Buffering...' : title}
        </Text>
      </View>
    );
  };

  const handlePress = () => {
    const { number } = nowPlaying;
    navigation.navigate('MusicPlayerScreen', { number });
  };

  const visibilityStyles = () => {
    if (isBackgroundMode) return { top: '100%' };

    return { bottom: 0 };
  };

  const handleOnRootLayout = ({ nativeEvent }) => {
    setNowPlayingLayoutInfoAction(nativeEvent.layout);
  };

  if (nowPlaying) {
    const { url: uri } = nowPlaying;

    return (
      <Pressable
        onPress={handlePress}
        onLayout={handleOnRootLayout}
        ref={rootComponent}
        style={{
          backgroundColor: '#202530',
          borderBottomWidth: 1,
          borderColor: theme.iplayya.colors.white10,
          position: 'absolute',
          left: 0,
          right: 0,
          ...visibilityStyles()
        }}
      >
        <Video
          paused={paused}
          source={{ uri }}
          onBuffer={handleBuffer}
          onError={handleError}
          onProgress={handleProgress}
          playInBackground
        />

        <View style={{ width: '100%', height: 1, backgroundColor: theme.iplayya.colors.white10 }}>
          <View
            style={{
              width: (progress * Dimensions.get('window').width) / 100,
              height: 1,
              backgroundColor: theme.iplayya.colors.vibrantpussy
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: theme.spacing(4),
            paddingHorizontal: theme.spacing(2)
          }}
        >
          <View style={{ flex: 8, flexDirection: 'row', alignItems: 'center' }}>
            {renderThumbnail(nowPlaying)}

            {renderContent(nowPlaying)}
          </View>
          <View
            style={{
              flex: 4,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {paused ? (
              <PausedAnimationPlaceholder style={{ marginHorizontal: 10 }} />
            ) : (
              <PlayingAnimationPlaceholder style={{ marginHorizontal: 10 }} />
            )}

            <Pressable onPress={() => setPausedAction(!paused)}>
              <Icon
                name={paused ? 'circular-play' : 'circular-pause'}
                size={32}
                style={{ marginHorizontal: 10 }}
              />
            </Pressable>
          </View>
        </View>
        {hasNotch && (
          <View style={{ height: 20, backgroundColor: '#202530' }}>
            <View style={{ height: 1, backgroundColor: theme.iplayya.colors.white10 }} />
          </View>
        )}
      </Pressable>
    );
  }

  /// return an empty component if nowPlaying is null
  return <View />;
};

NowPlaying.propTypes = {
  navigation: PropTypes.object,
  theme: PropTypes.object,
  paused: PropTypes.bool,
  setPausedAction: PropTypes.func,
  nowPlaying: PropTypes.object,
  playlist: PropTypes.array,
  setProgressAction: PropTypes.func,
  setNowPlayingAction: PropTypes.func,
  isBackgroundMode: PropTypes.bool,
  setNowPlayingLayoutInfoAction: PropTypes.func,
  updatePlaybackInfoAction: PropTypes.func,
  progress: PropTypes.number
};

const actions = {
  setNowPlayingAction: Creators.setNowPlaying,
  setProgressAction: Creators.setProgress,
  setNowPlayingLayoutInfoAction: Creators.setNowPlayingLayoutInfo,
  updatePlaybackInfoAction: Creators.updatePlaybackInfo,
  setPausedAction: Creators.setPaused
};

const mapStateToProps = createStructuredSelector({
  paused: selectPaused,
  progress: selectPlaybackProgress,
  nowPlaying: selectNowPlaying,
  playlist: selectPlaylist,
  album: selectAlbum,
  isBackgroundMode: selectIsBackgroundMode
});

export default connect(mapStateToProps, actions)(NowPlaying);
