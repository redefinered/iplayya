/* eslint-disable no-unused-vars */

import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, View, Modal, Animated } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import Video from 'react-native-video';
import FullScreenPlayer from './fullscreen-player.component';
import Controls from './controls.component';
import { connect } from 'react-redux';
import { Creators as MoviesActionCreators } from 'modules/ducks/movies/movies.actions';
import VerticalSlider from 'rn-vertical-slider';
import { urlEncodeTitle } from 'utils';
import { withAnchorPoint } from 'react-native-anchor-point';

const MediaPlayer = ({
  loading,
  setLoading,
  updatePlaybackInfoAction,
  source,
  thumbnail,
  title,
  paused,
  togglePlay
}) => {
  const theme = useTheme();
  const [showControls, setShowControls] = React.useState(true);
  const [fullscreen, setFullscreen] = React.useState(true);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [volume, setVolume] = React.useState(0.75);
  const [volumeSliderVisible, setVolumeSliderVisible] = React.useState(true);

  let timer = null;

  let player = React.useRef(null);

  const handleFullscreenToggle = () => {
    setFullscreen(!fullscreen);
  };

  const onBuffer = () => {
    console.log('buffer callback');
  };

  const videoError = () => {
    console.log('video error');
  };

  const handleProgress = (playbackInfo) => {
    setLoading(false);
    updatePlaybackInfoAction({ playbackInfo });
  };

  const hideControls = (duration = 5) => {
    return setTimeout(() => {
      setShowControls(false);
    }, duration * 1000);
  };

  React.useEffect(() => {
    if (paused) {
      clearTimeout(timer);
      setShowControls(true);
    } else {
      timer = hideControls(10);
    }
  }, [paused]);

  const toggleVolumeSliderVisible = () => {
    setVolumeSliderVisible(!volumeSliderVisible);
  };

  const transformStyles = () => {
    let transform = {
      transform: [{ rotateX: '90deg' }]
    };
    return withAnchorPoint(transform, { x: 0.5, y: 0 }, { width: '100%', height: '100%' });
  };

  if (fullscreen)
    return (
      <FullScreenPlayer
        currentTime={currentTime}
        paused={paused}
        handleProgress={handleProgress}
        source={source}
        player={player}
        volume={volume}
        thumbnail={thumbnail}
        onBuffer={onBuffer}
        videoError={videoError}
        volumeSliderVisible={volumeSliderVisible}
        setVolume={setVolume}
        loading={loading}
        title={title}
        togglePlay={togglePlay}
        handleFullscreenToggle={handleFullscreenToggle}
        showControls={showControls}
        setCurrentTime={setCurrentTime}
        toggleVolumeSliderVisible={toggleVolumeSliderVisible}
      />
    );

  return (
    <View style={{ position: 'relative' }}>
      {/* video */}
      <Video
        currentTime={currentTime}
        paused={paused}
        onProgress={handleProgress}
        // controls
        fullscreenOrientation="landscape"
        source={{ uri: source }}
        ref={player}
        volume={volume}
        onBuffer={() => onBuffer()}
        onError={() => videoError()}
        poster={
          thumbnail === 'N/A' || thumbnail === ''
            ? `https://via.placeholder.com/336x190.png?text=${urlEncodeTitle(title)}`
            : thumbnail
        }
        posterResizeMode="cover"
        style={{ width: Dimensions.get('window').width, height: 211, backgroundColor: 'black' }}
      />

      {/* volume slider */}
      {volumeSliderVisible ? (
        <View style={{ position: 'absolute', marginLeft: 20, paddingTop: 40, zIndex: 100 }}>
          <VerticalSlider
            width={8}
            height={100}
            value={volume}
            min={0}
            max={1}
            onChange={(value) => setVolume(value)}
            minimumTrackTintColor={theme.iplayya.colors.white100}
            maximumTrackTintColor={theme.iplayya.colors.white25}
          />
        </View>
      ) : null}

      {/* media player controls */}
      <Controls
        volume={volume}
        multipleMedia={false}
        loading={loading}
        title={title}
        togglePlay={togglePlay}
        paused={paused}
        toggleFullscreen={handleFullscreenToggle}
        style={{ position: 'absolute' }}
        visible={showControls}
        setCurrentTime={setCurrentTime}
        toggleVolumeSliderVisible={toggleVolumeSliderVisible}
      />
    </View>
  );
};

MediaPlayer.propTypes = {
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  title: PropTypes.string,
  source: PropTypes.string,
  thumbnail: PropTypes.string,
  paused: PropTypes.bool,
  togglePlay: PropTypes.func,
  updatePlaybackInfoAction: PropTypes.func
};

const actions = {
  updatePlaybackInfoAction: MoviesActionCreators.updatePlaybackInfo
};

export default connect(null, actions)(MediaPlayer);
