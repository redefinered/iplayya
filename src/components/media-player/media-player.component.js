/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, View, Modal, Pressable, ImageBackground } from 'react-native';
import { useTheme, Text, TouchableRipple } from 'react-native-paper';
import FullScreenPlayer from './fullscreen-player.component';
import Controls from './controls.component';
import { connect } from 'react-redux';
import { Creators as MoviesActionCreators } from 'modules/ducks/movies/movies.actions';
import { createFontFormat } from 'utils';
// import ContentWrap from 'components/content-wrap.component';
// import { TouchableOpacity } from 'react-native-gesture-handler';
// import resolutions from './video-resolutions.json';
// import castOptions from './screencast-options.json';
import Spacer from 'components/spacer.component';
import { VLCPlayer } from 'react-native-vlc-media-player';
import Video from 'react-native-video';
import uuid from 'react-uuid';

import GoogleCast, { useCastSession, useRemoteMediaClient } from 'react-native-google-cast';

const MediaPlayer = ({
  videoplayer,
  updatePlaybackInfoAction,
  source,
  thumbnail,
  title,
  seriesTitle,
  paused,
  togglePlay,
  setPaused,
  multipleMedia,
  videoUrls,
  setSource,
  previousAction,
  nextAction,
  isFirstEpisode,
  isLastEpisode,
  typename
}) => {
  const theme = useTheme();
  const castSession = useCastSession();
  const client = useRemoteMediaClient();

  const [error, setError] = React.useState(false);
  const [showControls, setShowControls] = React.useState(true);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [sliderPosition, setSliderPosition] = React.useState(null);
  const [volume, setVolume] = React.useState(0.6);
  const [volumeSliderVisible, setVolumeSliderVisible] = React.useState(false);
  const [showCastOptions, setShowCastOptions] = React.useState(false);
  const [showVideoOptions, setShowVideoOptions] = React.useState(false);
  const [activeState, setActiveState] = React.useState(null);
  // const [screencastActiveState, setScreencastActiveState] = React.useState(null);
  // const [screencastOption, setScreencastOption] = React.useState(null);
  const [resolution, setResolution] = React.useState('auto');
  const [resolutions, setResolutions] = React.useState([]);
  const [buffering, setBuffering] = React.useState(false);
  const [castSessionActive, setCastSessionActive] = React.useState(false);
  const [timer, setTimer] = React.useState();

  let player = React.useRef();

  let listener = null;

  React.useEffect(() => {
    if (!client) {
      return setCastSessionActive(false);
    }

    if (timer) clearTimeout(timer);
    setCastSessionActive(true);
  }, [client]);

  React.useEffect(() => {
    setCastSession();

    listener = GoogleCast.onCastStateChanged((castState) => {
      console.log({ castState });
      /// switch cast state
      switch (castState) {
        case 'connecting':
          setBuffering(true);
          break;
        case 'connected':
          /// pause whatever is playing when connected to chromecast
          setPaused(true);

          setBuffering(false);
          setCastSessionActive(true);
          break;
        case 'notConnected':
          setBuffering(false);
          setCastSessionActive(false);
          break;
        case 'noDevicesAvailable':
          setBuffering(false);
          setCastSessionActive(false);
          break;
        default:
          setBuffering(false);
          setCastSessionActive(false);
          break;
      }
      // 'noDevicesAvailable' | 'notConnected' | 'connecting' | 'connected'
    });

    return () => listener.remove();
  }, []);

  const setCastSession = async () => {
    if (castSession) {
      /// set castSessionActive if castSession is not null
      return setCastSessionActive(true);
    }

    return setCastSessionActive(false);
  };

  React.useEffect(() => {
    if (sliderPosition !== null) {
      player.current.seek(sliderPosition);
    }
  }, [sliderPosition]);

  React.useEffect(() => {
    /// for itv channels, videourls is undefined
    if (typeof videoUrls === 'undefined') return;

    if (videoUrls.length) {
      const resolutions = videoUrls.map(({ quality, link }, index) => {
        const name = quality.toLowerCase();
        const qsplit = name.split(' ');
        const qjoin = qsplit.join('_');

        return { id: index, name: `${qjoin}_${uuid()}`, label: quality, link };
      });

      /**
       * TODO: select lowest resolution depending on internet connection speed
       * select first one for now
       */
      resolutions.unshift({ id: 'auto', name: 'auto', label: 'Auto', link: videoUrls[0].link });
      setResolutions(resolutions);
    }
  }, [videoUrls]);

  React.useEffect(() => {
    let r = resolutions.find(({ name }) => name === resolution);
    if (typeof r !== 'undefined') return setSource(r.link.split(' ')[1]);
  }, [resolution]);

  const handleFullscreenToggle = () => {
    setFullscreen(!fullscreen);
  };

  const onBuffer = () => {
    console.log('buffering...');

    // prevents loader when buffering only in IPTV because buffering in IPTV is very frequent
    if (typename === 'Iptv') return;

    setBuffering(true);
    setShowControls(true);
  };

  const hideControls = (duration = 5) => {
    return setTimeout(() => {
      setShowControls(false);
      setVolumeSliderVisible(false);
    }, duration * 1000);
  };

  /// needs to be converted to effect since events are not available in react-native-video
  /// needs to be converted to effect since events are not available in react-native-video
  /// needs to be converted to effect since events are not available in react-native-video
  /// needs to be converted to effect since events are not available in react-native-video
  /// needs to be converted to effect since events are not available in react-native-video
  /// needs to be converted to effect since events are not available in react-native-video
  /// needs to be converted to effect since events are not available in react-native-video
  /// needs to be converted to effect since events are not available in react-native-video
  /// needs to be converted to effect since events are not available in react-native-video

  // const handleOnPlaying = (data) => {
  //   console.log('onPlaying callback', data);
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
      // console.log('paused');
      setShowControls(true);
      if (timer) clearTimeout(timer);
    } else {
      if (client) return;

      setTimer(hideControls(10));
    }
  }, [paused]);

  /// cancel hide control timeout if cast session is active
  React.useEffect(() => {
    if (castSessionActive) {
      if (timer) clearTimeout(timer);
      setShowControls(true);
    }
  }, [castSessionActive]);

  /// needs to be converted to effect since events are not available in react-native-video
  /// needs to be converted to effect since events are not available in react-native-video
  /// needs to be converted to effect since events are not available in react-native-video
  /// needs to be converted to effect since events are not available in react-native-video
  /// needs to be converted to effect since events are not available in react-native-video
  /// needs to be converted to effect since events are not available in react-native-video
  /// needs to be converted to effect since events are not available in react-native-video
  /// needs to be converted to effect since events are not available in react-native-video

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

  // const handleHideCastOptions = () => {
  //   setShowCastOptions(false);
  // };

  const handleToggleCastOptions = () => {
    setShowCastOptions(!showCastOptions);
  };

  // const handleHideVideoOptions = () => {

  // };

  const handleToggleVideoOptions = () => {
    setShowVideoOptions(!showVideoOptions);
  };

  const handleSelectResolution = (value) => {
    setShowVideoOptions(false);
    setResolution(value);
    setActiveState(null);
  };

  // const handleSelectScreencastOption = (val) => {
  //   setShowCastOptions(false);
  //   setScreencastOption(val);
  //   setScreencastActiveState(null);
  // };

  // console.log({ source, resolution, resolutions });
  // console.log({ resolutions });
  // console.log('source', source);
  // console.log('typename', typename);
  // console.log('volume', volume);

  const renderPlayer = () => {
    if (castSessionActive)
      return (
        <ImageBackground
          source={{ uri: thumbnail }}
          style={{ width: Dimensions.get('window').width, height: 211, background: thumbnail }}
        />
      );

    if (typename === 'Iptv' || videoplayer === 'vlc')
      return (
        <VLCPlayer
          // onPlaying={handleOnPlaying}
          // onPaused={handleOnPause}
          ref={player}
          paused={paused}
          seek={sliderPosition}
          onProgress={handleProgress}
          source={{ uri: source }}
          volume={volume}
          onBuffering={onBuffer}
          onError={videoError}
          resizeMode="contain"
          style={{ width: Dimensions.get('window').width, height: 211 }}
        />
      );

    return (
      <Video
        ref={player}
        paused={paused}
        onProgress={handleProgress}
        source={{ uri: source }}
        volume={volume}
        onBuffer={onBuffer}
        onError={videoError}
        resizeMode="contain"
        style={{ width: Dimensions.get('window').width, height: 211 }}
      />
    );
  };

  if (fullscreen)
    return (
      <FullScreenPlayer
        title={title}
        seriesTitle={seriesTitle}
        multipleMedia={multipleMedia}
        source={source}
        handleFullscreenToggle={handleFullscreenToggle}
        previousAction={previousAction}
        nextAction={nextAction}
        isFirstEpisode={isFirstEpisode}
        isLastEpisode={isLastEpisode}
        setSliderPosition={setSliderPosition}
        setPaused={setPaused}
        volume={volume}
        setVolume={setVolume}
        resolutions={resolutions}
        setSource={setSource}
        typename={typename}
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
      {renderPlayer()}

      {/* media player controls */}
      <Controls
        volume={volume}
        setVolume={setVolume}
        buffering={buffering}
        multipleMedia={multipleMedia}
        title={title}
        seriesTitle={seriesTitle}
        togglePlay={togglePlay}
        paused={paused}
        setPaused={setPaused}
        toggleFullscreen={handleFullscreenToggle}
        style={{ position: 'absolute' }}
        visible={showControls}
        setSliderPosition={setSliderPosition}
        toggleVolumeSliderVisible={toggleVolumeSliderVisible}
        toggleCastOptions={handleToggleCastOptions}
        toggleVideoOptions={handleToggleVideoOptions}
        previousAction={previousAction}
        nextAction={nextAction}
        isFirstEpisode={isFirstEpisode}
        isLastEpisode={isLastEpisode}
        resolutions={resolutions}
        resolution={resolution}
        activeState={activeState}
        setActiveState={setActiveState}
        handleSelectResolution={handleSelectResolution}
        typename={typename}
        source={source}
        castSessionActive={castSessionActive}
      />
      {/* screencast option */}
      {/* <Modal animationType="slide" visible={showCastOptions} transparent>
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
      </Modal> */}

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
            <TouchableRipple
              onPress={() => setShowVideoOptions(false)}
              style={{ alignItems: 'center', paddingVertical: 20 }}
            >
              <Text>Cancel</Text>
            </TouchableRipple>
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
  multipleMedia: PropTypes.bool,
  videoSource: PropTypes.string
};

const actions = {
  updatePlaybackInfoAction: MoviesActionCreators.updatePlaybackInfo
};

export default connect(null, actions)(MediaPlayer);
