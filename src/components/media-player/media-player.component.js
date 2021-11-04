import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, View, Pressable, ImageBackground, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import ButtonIconDefault from 'components/button-icon-default/button-icon-default.component';
import Controls from './controls.component';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/movies/movies.actions';
import Video from 'react-native-video';
import ResolutionsOptionsModal from './modal-resolution-options.component';
import ChromecastOptionsModal from './modal-cast-options.component';
import GoogleCast, { useCastSession, useRemoteMediaClient } from 'react-native-google-cast';
import SystemSetting from 'react-native-system-setting';
import theme from 'common/theme';
import { MODULE_TYPES } from 'common/values';
import uuid from 'react-uuid';

const VIDEO_HEIGHT = 211;

const VIDEO_STYLE = {
  width: Dimensions.get('window').width,
  height: VIDEO_HEIGHT,
  backgroundColor: 'black'
};
const VIDEO_STYLE_FULLSCREEN = {
  width: Dimensions.get('window').height,
  height: Dimensions.get('window').width
};

const MediaPlayer = ({
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
  isSeries,
  currentProgram,
  moduleType,
  updatePlaybackInfoAction
}) => {
  const castSession = useCastSession();
  const client = useRemoteMediaClient();
  const discoveryManager = GoogleCast.getDiscoveryManager();

  let player = React.useRef();

  let castListener = null;
  let volumeListener = null;

  // const sessionManager = GoogleCast.getSessionManager();

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
  const [videoStyle, setVideoStyle] = React.useState(VIDEO_STYLE);
  const [showChromecastOptions, setShowChromecastOptions] = React.useState(false);
  // const [chromeCastSession, setChromeCastSession] = React.useState(null);
  // console.log({ playbackInfo, thumbnail });

  const timer = React.useRef(null);

  React.useEffect(() => {
    /// starts discovery of chromcast devices
    discoveryManager.startDiscovery();

    setCastSession();

    volumeListener = SystemSetting.addVolumeListener(({ value }) => {
      console.log({ value });
      setVolume(value);
    });

    /// set the volume to be equal to system volume
    syncVolumeWithSystemVolume();

    castListener = GoogleCast.onCastStateChanged((castState) => {
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
        default:
          setBuffering(false);
          setCastSessionActive(false);
          break;
      }
      // 'noDevicesAvailable' | 'notConnected' | 'connecting' | 'connected'
    });

    return () => handleCleanup({ castListener, volumeListener });
  }, []);

  const handleCleanup = ({ castListener, volumeListener }) => {
    /// remove google-cast listener
    castListener.remove();

    /// remove system volume listener
    SystemSetting.removeVolumeListener(volumeListener);
  };

  React.useEffect(() => {
    if (!client) return;
    loadMedia(source);
  }, [source, client]);

  const getMetadata = () => {
    const common = {
      images: [
        {
          url: thumbnail
        }
      ]
    };

    if (moduleType === MODULE_TYPES.TV) {
      /// use generic title if no title found
      if (!currentProgram) return { type: 'tvShow', title: 'No title found.' };

      const { title: programTitle } = currentProgram;
      return {
        type: 'tvShow',
        title: programTitle,
        seriesTitle: title
      };
    }

    if (isSeries) {
      return {
        type: 'tvShow',
        title: seriesTitle,
        ...common
      };
    }

    return {
      type: 'movie',
      title,
      ...common
    };
  };

  const loadMedia = async (source) => {
    if (!client) return;

    try {
      await client.loadMedia({
        // autoplay: false,
        mediaInfo: {
          contentUrl: source,
          streamType: moduleType === MODULE_TYPES.TV ? 'live' : 'buffered',
          metadata: {
            ...getMetadata()
          },
          streamDuration: playbackInfo.seekableDuration
        }
        // startTime: playbackInfo.currentTime // seconds
      });
    } catch (error) {
      console.log({ error });
    }
  };

  /// switches root container style depending on screen orientation
  React.useEffect(() => {
    if (fullscreen) return setVideoStyle(VIDEO_STYLE_FULLSCREEN);

    return setVideoStyle(VIDEO_STYLE);
  }, [fullscreen]);

  React.useEffect(() => {
    SystemSetting.setVolume(volume, { showUI: false });
  }, [volume]);

  React.useEffect(() => {
    if (!client) {
      return setCastSessionActive(false);
    }

    if (timer.current) clearTimeout(timer.current);
    setCastSessionActive(true);
  }, [client]);

  const syncVolumeWithSystemVolume = async () => {
    const v = await SystemSetting.getVolume('system');
    setVolume(v);
  };

  const setCastSession = async () => {
    if (castSession) {
      /// set castSessionActive if castSession is not null
      return setCastSessionActive(true);
    }

    return setCastSessionActive(false);
  };

  React.useEffect(() => {
    if (castSessionActive) {
      if (!client) return;
      if (!sliderPosition) return;

      chromecastPlayerSeek(sliderPosition);
    }

    if (sliderPosition !== null) {
      if (!player.current) return;
      player.current.seek(sliderPosition);
    }
  }, [sliderPosition]);

  const chromecastPlayerSeek = async (position) => {
    await client.seek({ position });
  };

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
    if (moduleType === MODULE_TYPES.TV) return;

    setBuffering(true);
    setShowControls(true);
    // setTimer(hideControls(3));
  };

  const hideControls = (duration = 5) => {
    if (castSessionActive) return;

    timer.current = setTimeout(() => {
      setShowControls(false);
      setVolumeSliderVisible(false);
    }, duration * 1000);
  };

  React.useEffect(() => {
    if (paused) {
      // console.log('paused');
      setShowControls(true);
      if (timer.current) clearTimeout(timer.current);
    } else {
      if (client) return;

      /// don't hide controls if program did not buffer
      // if (!buffering) return;

      // setTimer(hideControls(10));
      hideControls(10);
    }
  }, [paused]);

  React.useEffect(() => {
    if (showControls) {
      if (timer.current) clearTimeout(timer.current);
      if (castSessionActive) return;

      hideControls(10);
    }
  }, [showControls, timer.current]);

  /// cancel hide control timeout if cast session is active
  // React.useEffect(() => {
  //   if (castSessionActive) {
  //     if (timer) clearTimeout(timer);
  //     setShowControls(true);
  //   }
  // }, [castSessionActive]);

  const handleVideoError = ({ error }) => {
    console.log({ errorxx: error });
    setVideoError(true);
  };

  const handleProgress = (playbackInfo) => {
    // console.log({ playbackInfo });
    setBuffering(false);
    updatePlaybackInfoAction({ playbackInfo });
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

  const handleErrorClose = () => {
    setFullscreen(false);
  };

  const renderControls = () => {
    if (videoError)
      return (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={{ color: theme.iplayya.colors.white50 }}>
            Error: video source unavailable
          </Text>
          {fullscreen && (
            <View style={{ position: 'absolute', top: 15, right: 15 }}>
              <ButtonIconDefault
                pressAction={handleErrorClose}
                iconName="close"
                iconSize={3}
                color={theme.iplayya.colors.white50}
              />
            </View>
          )}
        </View>
      );

    return (
      <Controls
        visible={showControls}
        // visible
        setShowControls={setShowControls}
        playbackInfo={playbackInfo}
        setPlaybackInfo={setPlaybackInfo}
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
        source={source}
        castSessionActive={castSessionActive}
        isFullscreen={fullscreen}
        setShowChromecastOptions={setShowChromecastOptions}
        moduleType={moduleType}
        style={{ position: 'absolute' }}
      />
    );
  };

  const handleChromecastOptionsCancel = () => {
    setShowChromecastOptions(false);
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
    <React.Fragment>
      <View
        style={{
          marginTop: fullscreen ? 0 : theme.spacing(2),
          marginBottom: fullscreen ? 0 : theme.spacing(2)
        }}
      >
        <View
          style={{
            backgroundColor: 'black',
            ...setFullScreenVideoContainerStyle()
          }}
        >
          {renderPlayer()}

          {renderControls()}
        </View>

        <ChromecastOptionsModal
          visible={showChromecastOptions}
          onCancelPress={handleChromecastOptionsCancel}
          handleHideList={() => setShowChromecastOptions(false)}
          // handleItemSelect={handleCastOptionSelect}
        />

        <ResolutionsOptionsModal
          visible={showVideoOptions}
          data={resolutions}
          handleSelectResolution={handleSelectResolution}
          setShowVideoOptions={setShowVideoOptions}
        />
      </View>
    </React.Fragment>
  );
};

MediaPlayer.defaultProps = {
  qualitySwitchable: false,
  moduleType: MODULE_TYPES.VOD
  // thumbnail:
};

MediaPlayer.propTypes = {
  currentProgram: PropTypes.object,
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
  moduleType: PropTypes.string,
  isSeries: PropTypes.bool
};

const actions = {
  updatePlaybackInfoAction: Creators.updatePlaybackInfo
};

export default connect(null, actions)(React.memo(MediaPlayer));
