import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, View, Modal, Pressable, ImageBackground } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
// import FullScreenPlayer from './fullscreen-player.component';
import Controls from './controls.component';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/movies/movies.actions';
import { createFontFormat } from 'utils';
import Spacer from 'components/spacer.component';
import Video from 'react-native-video';
import uuid from 'react-uuid';
import GoogleCast, { useCastSession, useRemoteMediaClient } from 'react-native-google-cast';
import SystemSetting from 'react-native-system-setting';
import DeviceInfo from 'react-native-device-info';
import theme from 'common/theme';

const VIDEO_HEIGHT = 211;

const VIDEO_STYLE = {
  width: Dimensions.get('window').width,
  height: VIDEO_HEIGHT,
  // marginBottom: theme.spacing(2),
  backgroundColor: 'black'
};
const VIDEO_STYLE_FULLSCREEN = {
  width: Dimensions.get('window').height,
  height: Dimensions.get('window').width
};

const MediaPlayer = ({
  // playbackInfo,
  // updatePlaybackInfoAction,
  // containerStyle,
  fullscreen,
  setFullscreen,
  source,
  qualitySwitchable,
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
  const castSession = useCastSession();
  const client = useRemoteMediaClient();
  // eslint-disable-next-line no-unused-vars
  const [videoError, setVideoError] = React.useState(false);
  const [playbackInfo, setPlaybackInfo] = React.useState(null);
  const [showControls, setShowControls] = React.useState(true);
  const [sliderPosition, setSliderPosition] = React.useState(null);
  const [volume, setVolume] = React.useState(0.5);
  const [volumeSliderVisible, setVolumeSliderVisible] = React.useState(false);
  const [showCastOptions, setShowCastOptions] = React.useState(false);
  const [showVideoOptions, setShowVideoOptions] = React.useState(false);
  const [activeState, setActiveState] = React.useState(null);
  const [resolution, setResolution] = React.useState('auto');
  const [resolutions, setResolutions] = React.useState([]);
  const [buffering, setBuffering] = React.useState(false);
  const [castSessionActive, setCastSessionActive] = React.useState(false);
  const [timer, setTimer] = React.useState();
  const [videoStyle, setVideoStyle] = React.useState(VIDEO_STYLE);

  // console.log({ volume });

  /// switches root container style depending on screen orientation
  React.useEffect(() => {
    if (fullscreen) return setVideoStyle(VIDEO_STYLE_FULLSCREEN);

    return setVideoStyle(VIDEO_STYLE);
  }, [fullscreen]);

  // console.log('test');

  React.useEffect(() => {
    SystemSetting.setVolume(volume, { showUI: false });
  }, [volume]);

  let player = React.useRef();

  let castListener = null;
  let volumeListener = null;

  React.useEffect(() => {
    if (!client) {
      return setCastSessionActive(false);
    }

    if (timer) clearTimeout(timer);
    setCastSessionActive(true);
  }, [client]);

  React.useEffect(() => {
    setCastSession();

    volumeListener = SystemSetting.addVolumeListener(({ value }) => {
      console.log({ value });
      setVolume(value);
    });

    /// set the volume to be equal to system volume
    syncVolumeWithSystemVolume();

    castListener = GoogleCast.onCastStateChanged((castState) => {
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

    return () => handleCleanup({ castListener, volumeListener });
  }, []);

  const syncVolumeWithSystemVolume = async () => {
    const v = await SystemSetting.getVolume('system');
    console.log({ v });
    setVolume(v);
  };

  const handleCleanup = ({ castListener, volumeListener }) => {
    /// remove google-cast listener
    castListener.remove();

    /// remove system volume listener
    SystemSetting.removeVolumeListener(volumeListener);
  };

  const setCastSession = async () => {
    if (castSession) {
      /// set castSessionActive if castSession is not null
      return setCastSessionActive(true);
    }

    return setCastSessionActive(false);
  };

  React.useEffect(() => {
    if (sliderPosition !== null) {
      if (!player.current) return;
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
    setShowControls(true);
    setFullscreen(!fullscreen);
  };

  const handleOnBuffer = () => {
    console.log('buffering...');

    setVideoError(false);

    // prevents loader when buffering only in IPTV because buffering in IPTV is very frequent
    if (typename === 'Iptv') return;

    setBuffering(true);
    setShowControls(true);
    // setTimer(hideControls(3));
  };

  const hideControls = (duration = 5) => {
    return setTimeout(() => {
      setShowControls(false);
      setVolumeSliderVisible(false);
    }, duration * 1000);
  };

  React.useEffect(() => {
    if (paused) {
      // console.log('paused');
      setShowControls(true);
      if (timer) clearTimeout(timer);
    } else {
      if (client) return;

      /// don't hide controls if program did not buffer
      // if (!buffering) return;

      setTimer(hideControls(10));
    }
  }, [paused]);

  React.useEffect(() => {
    if (showControls) hideControls();
  }, [showControls]);

  /// cancel hide control timeout if cast session is active
  React.useEffect(() => {
    if (castSessionActive) {
      if (timer) clearTimeout(timer);
      setShowControls(true);
    }
  }, [castSessionActive]);

  const handleVideoError = ({ error }) => {
    console.log({ error });
    setVideoError(true);
  };

  const handleProgress = (playbackInfo) => {
    // console.log({ playbackInfo });
    setBuffering(false);
    // updatePlaybackInfoAction({ playbackInfo });
    setPlaybackInfo(playbackInfo);
  };

  const toggleVolumeSliderVisible = () => {
    setVolumeSliderVisible(!volumeSliderVisible);
  };

  const handleToggleCastOptions = () => {
    setShowCastOptions(!showCastOptions);
  };

  const handleToggleVideoOptions = () => {
    setShowVideoOptions(!showVideoOptions);
  };

  const handleSelectResolution = (value) => {
    setShowVideoOptions(false);
    setResolution(value);
    setActiveState(null);
  };

  const renderPlayer = () => {
    // console.log({ source });
    if (castSessionActive)
      return (
        <ImageBackground
          source={{ uri: thumbnail }}
          style={{ width: Dimensions.get('window').width, height: 211, background: thumbnail }}
        />
      );

    return (
      <Pressable
        onPress={() => setShowControls(true)}
        style={{ alignItems: 'center', justifyContent: 'center' }}
      >
        <Video
          ref={player}
          paused={paused}
          onProgress={handleProgress}
          source={{ uri: source }}
          volume={volume}
          onBuffer={handleOnBuffer}
          onError={handleVideoError}
          resizeMode="contain"
          style={videoStyle}
        />
      </Pressable>
    );
  };

  const renderVideoError = () => {
    if (!videoError) return;

    return (
      <View style={{ paddingHorizontal: 15, marginTop: theme.spacing(2) }}>
        <Text>Error: source unavailable</Text>
      </View>
    );
  };

  const setFullScreenVideoContainerStyle = () => {
    if (!fullscreen) return {};
    return {
      transform: [{ rotate: '90deg' }],
      width: Dimensions.get('window').height,
      height: Dimensions.get('window').width
    };
  };

  return (
    <View
      style={{
        marginTop: fullscreen ? 0 : theme.spacing(2),
        marginBottom: fullscreen ? 0 : theme.spacing(2)
      }}
    >
      {/* <Button onPress={() => setFullscreen(!fullscreen)}>fullscreen</Button> */}
      {/* {error && (
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
      )} */}
      <View
        style={{
          backgroundColor: 'black',
          ...setFullScreenVideoContainerStyle()
        }}
      >
        {renderPlayer()}

        <Controls
          // visible
          visible={showControls}
          setShowControls={setShowControls}
          playbackInfo={playbackInfo}
          qualitySwitchable={qualitySwitchable}
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
          isFullscreen={fullscreen}
          style={{ position: 'absolute' }}
        />
      </View>

      {renderVideoError()}

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
              style={{
                alignItems: 'center',
                paddingVertical: 20,
                paddingBottom: DeviceInfo.hasNotch() ? 33 : 20
              }}
            >
              <Text>Cancel</Text>
            </TouchableRipple>
          </View>
        </View>
      </Modal>
    </View>
  );
};

MediaPlayer.defaultProps = {
  qualitySwitchable: false
};

MediaPlayer.propTypes = {
  fullscreen: PropTypes.bool,
  title: PropTypes.string,
  seriesTitle: PropTypes.string,
  source: PropTypes.string,
  thumbnail: PropTypes.string,
  paused: PropTypes.bool,
  togglePlay: PropTypes.func,
  setPaused: PropTypes.func,
  setSource: PropTypes.func,
  setFullscreen: PropTypes.func,
  previousAction: PropTypes.func,
  nextAction: PropTypes.func,
  updatePlaybackInfoAction: PropTypes.func,
  multipleMedia: PropTypes.bool,
  isFirstEpisode: PropTypes.bool,
  isLastEpisode: PropTypes.bool,
  videoSource: PropTypes.string,
  videoUrls: PropTypes.array,
  qualitySwitchable: PropTypes.bool,
  typename: PropTypes.string
};

const actions = {
  updatePlaybackInfoAction: Creators.updatePlaybackInfo
};

export default connect(null, actions)(React.memo(MediaPlayer));
