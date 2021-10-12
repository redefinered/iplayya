import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import Video from 'react-native-video';
import MediaProgressVisualizer from './media-progress-visualizer.component';
import PlayingAnimationPlaceholder from 'assets/animation-placeholder.svg';
import PausedAnimationPlaceholder from 'assets/paused-animation-placeholder.svg';
import { createFontFormat } from 'utils';
import {
  selectNowPlaying,
  selectIsBackgroundMode,
  selectAlbum,
  selectPlaylist,
  selectPaused,
  selectRepeat,
  selectSeekValue,
  selectAlbumId,
  selectIsInImusicScreen
} from 'modules/ducks/music/music.selectors';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/music/music.actions';
import { createStructuredSelector } from 'reselect';
import DeviceInfo from 'react-native-device-info';
import clone from 'lodash/clone';
import theme from 'common/theme';

const coverplaceholder = require('assets/imusic-placeholder.png');

const NowPlaying = ({
  navigation,
  albumId,
  nowPlaying,
  playlist,
  setProgressAction,
  setNowPlayingAction,
  isBackgroundMode,
  setNowPlayingLayoutInfoAction,
  updatePlaybackInfoAction,
  paused,
  setPausedAction,
  repeat,
  seekValue,
  isInImusicScreen
}) => {
  const rootComponent = React.useRef();
  const player = React.useRef();

  const [buffering, setBuffering] = React.useState(false);
  const [playbackInfo, setPlaybackInfo] = React.useState(null);

  // eslint-disable-next-line no-unused-vars
  const [hasNotch, setHasNotch] = React.useState(false);

  React.useEffect(() => {
    /// shows the bottom padding for devices with notch. not yet fully tested
    if (DeviceInfo.hasNotch()) setHasNotch(true);
  }, []);

  // jumps to seek value specified
  React.useEffect(() => {
    if (seekValue) {
      if (typeof player.current === 'undefined') return;

      player.current.seek(seekValue);
    }
  }, [seekValue]);

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

    if (nextTrackNumber > playlist.length) {
      if (repeat.value === 'none') {
        // reset progress
        setProgressAction(0);

        // turn playing off
        setPausedAction(true);

        // setNowPlayingAction(null);

        return;
      } else {
        if (repeat.value === 'all') {
          // reset progress
          setProgressAction(0);

          const { number, sequence } = playlist.find(({ sequence }) => sequence === 1);

          setNowPlayingAction(
            {
              number: parseInt(number),
              sequence: parseInt(sequence)
            },
            false
          );

          return;
        }
      }
    }

    if (repeat.value === 'one') {
      setPausedAction(true);
      // set next track to nowPlaying
      const { number, sequence } = nowPlaying;

      setNowPlayingAction(
        {
          number: parseInt(number),
          sequence: parseInt(sequence)
        },
        false
      );

      setPausedAction(false);

      // reset progress
      setProgressAction(0);

      return;
    }

    // repeat is set to "none" and next track is not greater than the total number of tracks

    const { number, sequence } = playlist.find(
      ({ sequence }) => nextTrackNumber === parseInt(sequence)
    );

    setNowPlayingAction(
      {
        number: parseInt(number),
        sequence: parseInt(sequence)
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

    if (typeof thumbnail === 'undefined')
      return (
        <Image
          source={coverplaceholder}
          style={{ width: 60, height: 60, borderRadius: 8, marginRight: 15 }}
        />
      );

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
          <Text style={{ color: theme.iplayya.colors.white50, ...createFontFormat(12, 16) }}>
            {artist}
          </Text>
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
    navigation.navigate('MusicPlayerScreen', { trackId: nowPlaying.id, albumId });
  };

  const visibilityStyles = () => {
    if (isBackgroundMode) return { top: '100%' };

    return { bottom: isInImusicScreen ? 75.3 : 0 };
  };

  const handleOnRootLayout = ({ nativeEvent }) => {
    setNowPlayingLayoutInfoAction(nativeEvent.layout);
  };

  const renderPlayer = () => {
    const { url: uri } = nowPlaying;

    return (
      <Video
        ref={player}
        paused={paused}
        source={{ uri }}
        onBuffer={handleBuffer}
        onError={handleError}
        onProgress={handleProgress}
        playInBackground
      />
    );
  };

  if (nowPlaying) {
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
        {renderPlayer()}

        <MediaProgressVisualizer />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: theme.spacing(2),
            paddingTop: theme.spacing(2),
            paddingBottom: DeviceInfo.hasNotch() ? theme.spacing(4) : theme.spacing(2)
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
                size={theme.iconSize(4)}
                style={{ marginHorizontal: 10 }}
              />
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  }

  /// return an empty component if nowPlaying is null
  return <View />;
};

NowPlaying.propTypes = {
  track: PropTypes.object,
  navigation: PropTypes.object,
  theme: PropTypes.object,
  albumId: PropTypes.string,
  paused: PropTypes.bool,
  setPausedAction: PropTypes.func,
  nowPlaying: PropTypes.object,
  playlist: PropTypes.array,
  setProgressAction: PropTypes.func,
  setNowPlayingAction: PropTypes.func,
  isBackgroundMode: PropTypes.bool,
  setNowPlayingLayoutInfoAction: PropTypes.func,
  updatePlaybackInfoAction: PropTypes.func,
  // progress: PropTypes.number,
  repeat: PropTypes.object,
  seekValue: PropTypes.number,
  isInImusicScreen: PropTypes.bool
};

const actions = {
  setNowPlayingAction: Creators.setNowPlaying,
  setProgressAction: Creators.setProgress,
  setNowPlayingLayoutInfoAction: Creators.setNowPlayingLayoutInfo,
  updatePlaybackInfoAction: Creators.updatePlaybackInfo,
  setPausedAction: Creators.setPaused
};

const mapStateToProps = createStructuredSelector({
  albumId: selectAlbumId,
  paused: selectPaused,
  nowPlaying: selectNowPlaying,
  playlist: selectPlaylist,
  album: selectAlbum,
  isBackgroundMode: selectIsBackgroundMode,
  repeat: selectRepeat,
  seekValue: selectSeekValue,
  isInImusicScreen: selectIsInImusicScreen
});

export default connect(mapStateToProps, actions)(React.memo(NowPlaying));
