/* eslint-disable no-unused-vars */

import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, View, Modal, Pressable } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import FullScreenPlayer from './fullscreen-player.component';
import Controls from './controls.component';
import { connect } from 'react-redux';
import { Creators as MoviesActionCreators } from 'modules/ducks/movies/movies.actions';
import VerticalSlider from 'rn-vertical-slider';
import { urlEncodeTitle, createFontFormat } from 'utils';
import ContentWrap from 'components/content-wrap.component';
import { TouchableOpacity } from 'react-native-gesture-handler';
import resolutions from './video-resolutions.json';
import castOptions from './screencast-options.json';
import Spacer from 'components/spacer.component';
import { VLCPlayer, VlCPlayerView } from 'react-native-vlc-media-player';

const MediaPlayer = ({
  updatePlaybackInfoAction,
  source,
  thumbnail,
  title,
  paused,
  togglePlay,
  setPaused,
  isSeries
}) => {
  const theme = useTheme();
  const [error, setError] = React.useState(false);
  const [showControls, setShowControls] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [volume, setVolume] = React.useState(75);
  const [volumeSliderVisible, setVolumeSliderVisible] = React.useState(false);
  const [showCastOptions, setShowCastOptions] = React.useState(false);
  const [showVideoOptions, setShowVideoOptions] = React.useState(false);
  const [activeState, setActiveState] = React.useState(null);
  const [screencastActiveState, setScreencastActiveState] = React.useState(null);
  const [screencastOption, setScreencastOption] = React.useState(null);
  const [resolution, setResolution] = React.useState('auto');
  const [buffering, setBuffering] = React.useState(false);

  // console.log({ sourcex: source, type });

  let timer = null;

  let player = React.useRef(null);

  const handleFullscreenToggle = () => {
    setFullscreen(!fullscreen);
  };

  const onBuffer = () => {
    setError(false);
    setBuffering(true);
    setShowControls(true);
    console.log('buffer callback');
  };

  const handleOnPlaying = () => {
    console.log('onPlaying callback');
    // timer = hideControls(10);
  };

  const videoError = () => {
    setBuffering(false);
    setError(true);
  };

  const handleProgress = (playbackInfo) => {
    console.log('onProgress callback');
    setBuffering(false);
    updatePlaybackInfoAction({ playbackInfo });
    setPaused(false);
    timer = hideControls(10);
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

  // console.log('source', source);

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
        onPlaying={() => handleOnPlaying()}
        videoError={videoError}
        volumeSliderVisible={volumeSliderVisible}
        setVolume={setVolume}
        buffering={buffering}
        title={title}
        togglePlay={togglePlay}
        handleFullscreenToggle={handleFullscreenToggle}
        showControls={showControls}
        setCurrentTime={setCurrentTime}
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
      />
    );

  return (
    <View style={{ position: 'relative', backgroundColor: 'black' }}>
      {error && (
        <View
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text>VIDEO ERROR</Text>
        </View>
      )}

      <VLCPlayer
        autoplay={false}
        ref={player}
        paused={paused}
        seek={currentTime}
        onProgress={handleProgress}
        source={{ uri: source }}
        volume={volume}
        onBuffering={() => onBuffer()}
        onPlaying={() => handleOnPlaying()}
        onError={() => videoError()}
        resizeMode="contain"
        style={{ width: Dimensions.get('window').width, height: 211 }}
      />

      {/* volume slider */}
      {volumeSliderVisible ? (
        <View style={{ position: 'absolute', marginLeft: 20, paddingTop: 40, zIndex: 100 }}>
          <VerticalSlider
            width={8}
            height={100}
            value={volume}
            min={0}
            max={100}
            onChange={(value) => setVolume(parseInt(value))}
            minimumTrackTintColor={theme.iplayya.colors.white100}
            maximumTrackTintColor={theme.iplayya.colors.white25}
          />
        </View>
      ) : null}

      {/* media player controls */}
      <Controls
        volume={volume}
        buffering={buffering}
        multipleMedia={isSeries}
        title={title}
        togglePlay={togglePlay}
        paused={paused}
        toggleFullscreen={handleFullscreenToggle}
        style={{ position: 'absolute' }}
        visible={showControls}
        setCurrentTime={setCurrentTime}
        toggleVolumeSliderVisible={toggleVolumeSliderVisible}
        toggleCastOptions={handleToggleCastOptions}
        toggleVideoOptions={handleToggleVideoOptions}
      />

      {/* screencast option */}
      <Modal animationType="slide" visible={showCastOptions} transparent>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#202530', paddingTop: 20 }}>
            <ContentWrap>
              <Text style={{ fontWeight: '700', marginBottom: 10, ...createFontFormat(20, 28) }}>
                Connect to a device
              </Text>
            </ContentWrap>

            {castOptions.map(({ id, name, label }) => (
              <Pressable
                key={id}
                onPressIn={() => setScreencastActiveState(name)}
                onPress={() => handleSelectScreencastOption(name)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 50,
                  backgroundColor:
                    screencastActiveState === name ? theme.iplayya.colors.white10 : 'transparent',
                  paddingHorizontal: 15
                }}
              >
                <View style={{ flex: 1.5 }}>
                  <Icon name="airplay" size={20} />
                </View>
                <View style={{ flex: 10.5 }}>
                  <Text
                    style={{
                      color:
                        screencastOption === name
                          ? theme.iplayya.colors.vibrantpussy
                          : theme.colors.text,
                      ...createFontFormat(16, 22)
                    }}
                  >
                    {label}
                  </Text>
                </View>
              </Pressable>
            ))}

            <View
              style={{ width: '100%', height: 1, backgroundColor: theme.iplayya.colors.white10 }}
            />
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <TouchableOpacity onPress={() => handleHideCastOptions()}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* video settings */}
      <Modal animationType="slide" visible={showVideoOptions} transparent>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#202530', paddingTop: 20 }}>
            {resolutions.map(({ id, name, label }) => (
              <Pressable
                key={id}
                onPressIn={() => setActiveState(name)}
                onPress={() => handleSelectResolution(name)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 50,
                  backgroundColor:
                    activeState === name ? theme.iplayya.colors.white10 : 'transparent',
                  paddingHorizontal: 15
                }}
              >
                <View style={{ flex: 10.5 }}>
                  <Text
                    style={{
                      color:
                        resolution === name ? theme.iplayya.colors.vibrantpussy : theme.colors.text,
                      ...createFontFormat(16, 22)
                    }}
                  >
                    {label}
                  </Text>
                </View>
              </Pressable>
            ))}
            <Spacer size={20} />
            <View
              style={{ width: '100%', height: 1, backgroundColor: theme.iplayya.colors.white10 }}
            />
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <TouchableOpacity onPress={() => handleHideVideoOptions()}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

MediaPlayer.propTypes = {
  title: PropTypes.string,
  source: PropTypes.string,
  thumbnail: PropTypes.string,
  paused: PropTypes.bool,
  togglePlay: PropTypes.func,
  setPaused: PropTypes.func,
  updatePlaybackInfoAction: PropTypes.func,
  isSeries: PropTypes.bool,
  videoSource: PropTypes.string
};

const actions = {
  updatePlaybackInfoAction: MoviesActionCreators.updatePlaybackInfo
};

export default connect(null, actions)(MediaPlayer);
