import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, View, Modal, Pressable } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import Video from 'react-native-video';
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

// const temp = require('/data/user/0/com.iplayya/files/35466_God_of_War.mp4');
// const samplevideo = require('assets/sample-mp4-file.mp4');
// eslint-disable-next-line no-unused-vars
const samplenetworkvideo =
  'https://firebasestorage.googleapis.com/v0/b/iplayya.appspot.com/o/12AngryMen.mp4?alt=media&token=e5fbea09-e383-4fbb-85bd-206bceb4ef4d';

const MediaPlayer = ({
  loading,
  setLoading,
  updatePlaybackInfoAction,
  source,
  thumbnail,
  title,
  paused,
  togglePlay
  // type
}) => {
  const theme = useTheme();
  const [showControls, setShowControls] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [volume, setVolume] = React.useState(0.75);
  const [volumeSliderVisible, setVolumeSliderVisible] = React.useState(false);
  const [showCastOptions, setShowCastOptions] = React.useState(false);
  const [showVideoOptions, setShowVideoOptions] = React.useState(false);
  const [activeState, setActiveState] = React.useState(null);
  const [screencastActiveState, setScreencastActiveState] = React.useState(null);
  const [screencastOption, setScreencastOption] = React.useState(null);
  const [resolution, setResolution] = React.useState('auto');

  // console.log({ sourcex: source, type });

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

  console.log({ source });

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
    <View style={{ position: 'relative' }}>
      {/* video */}
      <Video
        currentTime={currentTime}
        paused={paused}
        onProgress={handleProgress}
        source={{ uri: source }}
        // source={samplevideo}
        // source={{ uri: 'http://185.152.64.163:2080/435/mpegts' }}
        ref={player}
        volume={volume}
        onBuffer={() => onBuffer()}
        onError={() => videoError()}
        poster={
          thumbnail === 'N/A' || thumbnail === ''
            ? `https://via.placeholder.com/336x190.png?text=${urlEncodeTitle(title)}`
            : thumbnail
        }
        resizeMode="contain"
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
