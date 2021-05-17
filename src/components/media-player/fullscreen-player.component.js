/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React from 'react';
import PropTypes from 'prop-types';
import { Modal, View, Dimensions, StatusBar } from 'react-native';
import { useTheme } from 'react-native-paper';
import Video from 'react-native-video';
import Controls from './controls.component';
// import VerticalSlider from 'rn-vertical-slider';
import Slider from '@react-native-community/slider';
import { VLCPlayer } from 'react-native-vlc-media-player';

import { urlEncodeTitle } from 'utils';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/movies/movies.actions';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const FullScreenPlayer = ({
  title,
  seriesTitle,
  source,
  updatePlaybackInfoAction,
  handleFullscreenToggle,
  multipleMedia,
  previousAction,
  nextAction,
  isFirstEpisode,
  isLastEpisode
  // setSliderPosition
}) => {
  const theme = useTheme();

  const [paused, setPaused] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [showControls, setShowControls] = React.useState(true);
  // const [fullscreen, setFullscreen] = React.useState(false);
  const [sliderPosition, setSliderPosition] = React.useState(null);
  const [volume, setVolume] = React.useState(75);
  const [volumeSliderVisible, setVolumeSliderVisible] = React.useState(false);
  const [showCastOptions, setShowCastOptions] = React.useState(false);
  const [showVideoOptions, setShowVideoOptions] = React.useState(false);
  const [activeState, setActiveState] = React.useState(null);
  const [screencastActiveState, setScreencastActiveState] = React.useState(null);
  const [screencastOption, setScreencastOption] = React.useState(null);
  const [resolution, setResolution] = React.useState('auto');
  const [buffering, setBuffering] = React.useState(false);
  const [timer, setTimer] = React.useState();

  // console.log({ sourcex: source, type });

  let player = React.useRef();

  React.useEffect(() => {
    if (sliderPosition !== null) {
      player.current.seek(sliderPosition);
    }
  }, [sliderPosition]);

  // const handleFullscreenToggle = () => {
  //   setFullscreen(!fullscreen);
  // };

  // console.log({ fullscreen });

  const onBuffer = () => {
    console.log('buffering...');
    setBuffering(true);
    setShowControls(true);
  };

  const hideControls = (duration = 5) => {
    return setTimeout(() => {
      setShowControls(false);
    }, duration * 1000);
  };

  // const handleOnPlaying = (data) => {
  //   console.log('onPlaying callback');
  //   setPaused(false);
  //   setTimer(hideControls(10));
  // };

  // const handleOnPause = () => {
  //   console.log('paused');
  //   setShowControls(true);
  //   if (timer) clearTimeout(timer);
  // };

  React.useEffect(() => {
    if (paused) {
      console.log('paused');
      setShowControls(true);
      if (timer) clearTimeout(timer);
    } else {
      console.log('onPlaying callback');
      setPaused(false);
      setTimer(hideControls(10));
    }
  }, [paused]);

  const videoError = () => {
    setError(true);
  };

  const handleProgress = (playbackInfo) => {
    setBuffering(false);
    updatePlaybackInfoAction({ playbackInfo });
  };

  const toggleVolumeSliderVisible = () => {
    setVolumeSliderVisible(!volumeSliderVisible);
  };

  const handleHideCastOptions = () => {
    setShowCastOptions(false);
  };

  const handleToggleCastOptions = () => {
    setShowCastOptions(!showCastOptions);
  };

  const handleHideVideoOptions = () => {
    setShowVideoOptions(false);
  };

  const handleToggleVideoOptions = () => {
    setShowVideoOptions(!showVideoOptions);
  };

  const handleSelectResolution = (value) => {
    setShowVideoOptions(false);
    setResolution(value);
    setActiveState(null);
  };

  const handleSelectScreencastOption = (val) => {
    setShowCastOptions(false);
    setScreencastOption(val);
    setScreencastActiveState(null);
  };

  const togglePlay = () => {
    setPaused(!paused);
  };

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

          {/* <VLCPlayer
            autoplay={false}
            onPaused={handleOnPause}
            ref={player}
            paused={paused}
            seek={currentTime}
            onProgress={handleProgress}
            source={{ uri: source }}
            volume={volume}
            onBuffering={onBuffer}
            onPlaying={handleOnPlaying}
            onError={videoError}
            resizeMode="contain"
            style={{
              width: HEIGHT,
              height: WIDTH
            }}
          /> */}

          <Video
            ref={player}
            paused={paused}
            onProgress={handleProgress}
            source={{ uri: source }}
            volume={volume}
            onBuffer={onBuffer}
            onError={videoError}
            resizeMode="contain"
            style={{ width: HEIGHT, height: WIDTH }}
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
            multipleMedia={multipleMedia}
            buffering={buffering}
            title={title}
            seriesTitle={seriesTitle}
            togglePlay={togglePlay}
            paused={paused}
            setPaused={setPaused}
            toggleFullscreen={handleFullscreenToggle}
            visible={showControls}
            setSliderPosition={setSliderPosition}
            toggleVolumeSliderVisible={toggleVolumeSliderVisible}
            toggleCastOptions={handleToggleCastOptions}
            toggleVideoOptions={handleToggleVideoOptions}
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
            previousAction={previousAction}
            nextAction={nextAction}
            isFirstEpisode={isFirstEpisode}
            isLastEpisode={isLastEpisode}
          />
        </View>
      </View>
    </Modal>
  );
};

const actions = {
  updatePlaybackInfoAction: Creators.updatePlaybackInfo
};

export default connect(null, actions)(FullScreenPlayer);
