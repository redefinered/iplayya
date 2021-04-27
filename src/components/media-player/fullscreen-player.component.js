/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, View, Dimensions, StatusBar } from 'react-native';
import { useTheme } from 'react-native-paper';
// import Video from 'react-native-video';
import Controls from './controls.component';
// import VerticalSlider from 'rn-vertical-slider';
import Slider from '@react-native-community/slider';
import { VLCPlayer } from 'react-native-vlc-media-player';

import { urlEncodeTitle } from 'utils';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const FullScreenPlayer = (props) => {
  const {
    currentTime,
    paused,
    handleProgress,
    source,
    player,
    volume,
    onBuffer,
    onPlaying,
    videoError,
    volumeSliderVisible,
    setVolume,
    buffering,
    title,
    togglePlay,
    handleFullscreenToggle,
    showControls,
    setCurrentTime,
    toggleVolumeSliderVisible,
    toggleCastOptions,
    toggleVideoOptions,
    screencastOption,
    handleSelectScreencastOption,
    setScreencastActiveState,
    showCastOptions,
    showVideoOptions,
    handleSelectResolution,
    setActiveState,
    resolution
  } = props;

  const theme = useTheme();

  return (
    <Modal>
      <StatusBar hidden />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View
          style={{
            // position: 'absolute',
            width: HEIGHT,
            height: WIDTH,
            transform: [{ rotate: '90deg' }],
            justifyContent: 'center',
            backgroundColor: 'black'
          }}
        >
          {/* <Video
            currentTime={currentTime}
            paused={paused}
            onProgress={handleProgress}
            fullscreenOrientation="landscape"
            source={{ uri: source }}
            ref={player}
            volume={volume}
            onBuffer={() => onBuffer()}
            onError={() => videoError()}
            poster={
              thumbnail === 'N/A' || thumbnail === ''
                ? `https://via.placeholder.com/${HEIGHT}x${WIDTH}.png?text=${urlEncodeTitle(title)}`
                : thumbnail
            }
            resizeMode="contain"
            posterResizeMode="cover"
            style={{
              position: 'absolute',
              width: HEIGHT,
              height: WIDTH,
              backgroundColor: 'black'
            }}
          /> */}

          <VLCPlayer
            autoplay={false}
            ref={player}
            paused={paused}
            seek={currentTime}
            onProgress={handleProgress}
            source={{ uri: source }}
            volume={volume}
            onBuffering={() => onBuffer()}
            onPlaying={() => onPlaying()}
            onError={() => videoError()}
            resizeMode="contain"
            style={{
              width: HEIGHT,
              height: WIDTH
            }}
          />

          {/* volume slider */}
          {/* {volumeSliderVisible ? (
            
          ) : null} */}

          <Slider
            style={{
              zIndex: 110,
              width: 200,
              position: 'relative',
              left: -100 + 24,
              opacity: volumeSliderVisible ? 1 : 0
            }}
            onValueChange={(value) => setVolume(value)}
            value={volume}
            minimumValue={0}
            maximumValue={1}
            transform={[{ rotate: '-90deg' }]}
            minimumTrackTintColor={theme.iplayya.colors.white100}
            maximumTrackTintColor={theme.iplayya.colors.white25}
          />

          {/* media player controls */}
          <Controls
            volume={volume}
            multipleMedia={false}
            buffering={buffering}
            title={title}
            togglePlay={togglePlay}
            paused={paused}
            toggleFullscreen={handleFullscreenToggle}
            visible={showControls}
            setCurrentTime={setCurrentTime}
            toggleVolumeSliderVisible={toggleVolumeSliderVisible}
            toggleCastOptions={toggleCastOptions}
            toggleVideoOptions={toggleVideoOptions}
            screencastOption={screencastOption}
            handleSelectScreencastOption={handleSelectScreencastOption}
            setScreencastActiveState={setScreencastActiveState}
            showCastOptions={showCastOptions}
            showVideoOptions={showVideoOptions}
            handleSelectResolution={handleSelectResolution}
            setActiveState={setActiveState}
            resolution={resolution}
            style={{
              position: 'absolute',
              zIndex: 100,
              width: HEIGHT,
              height: WIDTH
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

FullScreenPlayer.propTypes = {
  buffering: PropTypes.bool,
  setLoading: PropTypes.func,
  title: PropTypes.string,
  source: PropTypes.string,
  thumbnail: PropTypes.string,
  paused: PropTypes.bool,
  togglePlay: PropTypes.func,
  updatePlaybackInfoAction: PropTypes.func,
  currentTime: PropTypes.number,
  handleProgress: PropTypes.func,
  player: PropTypes.object,
  volume: PropTypes.number,
  onBuffer: PropTypes.func,
  onPlaying: PropTypes.func,
  videoError: PropTypes.func,
  volumeSliderVisible: PropTypes.string,
  setVolume: PropTypes.string,
  handleFullscreenToggle: PropTypes.string,
  showControls: PropTypes.bool,
  setCurrentTime: PropTypes.string,
  toggleVolumeSliderVisible: PropTypes.any,
  toggleCastOptions: PropTypes.func,
  toggleVideoOptions: PropTypes.func,
  screencastOption: PropTypes.string,
  handleSelectScreencastOption: PropTypes.func,
  setScreencastActiveState: PropTypes.func,
  showCastOptions: PropTypes.bool,
  showVideoOptions: PropTypes.bool,
  handleSelectResolution: PropTypes.func,
  setActiveState: PropTypes.func,
  resolution: PropTypes.string
};

export default FullScreenPlayer;
