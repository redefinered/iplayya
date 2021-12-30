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
import { MODULE_TYPES } from 'common/globals';
import uuid from 'react-uuid';
import VolumeContext from 'contexts/volume/volume.context';

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
  title,
  source,
  setSource,
  fullscreen,
  setFullscreen,
  thumbnail,
  seriesTitle,
  paused,
  togglePlay,
  setPaused,
  multipleMedia,
  videoUrls,
  previousAction,
  nextAction,
  isFirstEpisode,
  isLastEpisode,
  isSeries,
  currentProgram,
  moduleType,
  updatePlaybackInfoAction,
  qualitySwitchable,
  // eslint-disable-next-line react/prop-types
  videoLength
}) => {
  // const { volume, setVolume } = React.useContext(VolumeContext);

  // console.log({ volume });
  const castSession = useCastSession();
  const client = useRemoteMediaClient();

  let player = React.useRef();

  let castListener = null;
  let volumeListener = null;

  // const sessionManager = GoogleCast.getSessionManager();

  const [videoError, setVideoError] = React.useState(false);
  const [playbackInfo, setPlaybackInfo] = React.useState(null);
  const [showControls, setShowControls] = React.useState(true);
  const [sliderPosition, setSliderPosition] = React.useState(null);
  const [volume, setVolume] = React.useState(0);
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
  // eslint-disable-next-line no-unused-vars
  const [isLandscape, setIsLandscape] = React.useState(false);
  // const [chromeCastSession, setChromeCastSession] = React.useState(null);

  const timer = React.useRef(null);

  React.useEffect(() => {
    // subscribe to orientation change
    const orientationChangeListener = Dimensions.addEventListener('change', ({ window }) => {
      const { width, height } = window;

      if (width > height) {
        setIsLandscape(true);
      } else {
        setIsLandscape(false);
      }
    });

    return () => orientationChangeListener?.remove();
  });

  // React.useEffect(() => {
  //   if (isLandscape) {
  //     setFullscreen(true);
  //   } else {
  //     setFullscreen(false);
  //   }
  // }, [isLandscape]);

  React.useEffect(() => {
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

  // const onOrientationChange = ({ window }) => {
  //   const { width, height } = window;
  //   if (width > height) {
  //     setIsLandscape(true);
  //   } else {
  //     setIsLandscape(false);
  //   }
  // };

  // console.log({ isLandscape });

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

  React.useEffect(() => {
    if (castSessionActive) return;
    if (!playbackInfo) return;

    player.current.seek(playbackInfo.currentTime);
  }, [source]);

  const getMetadata = () => {
    // const common = {
    //   images: [
    //     {
    //       url: thumbnail
    //     }
    //   ]
    // };

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
        title: seriesTitle
        // ...common
      };
    }

    return {
      type: 'movie',
      title
      // ...common
    };
  };

  const loadMedia = async (source) => {
    console.log({ source });
    if (!client) return;

    try {
      await client.loadMedia({
        // autoplay: false,
        mediaInfo: {
          contentUrl: source,
          // contentUrl: 'http://vod3.freeddns.org:80/195181164146/12AngryMen.mp4',
          streamType: moduleType === MODULE_TYPES.TV ? 'live' : 'buffered',
          metadata: {
            ...getMetadata()
          },
          streamDuration: videoLength * 60
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

  // React.useEffect(() => {
  //   SystemSetting.setVolume(volume, { showUI: false });
  // }, [volume]);

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
          playWhenInactive
          playInBackground // allows airplay background playback
          ignoreSilentSwitch="ignore" // allows airplay background playback
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
      <VolumeContext.Provider value={{ volume, setVolume }}>
        <Controls
          visible
          // visible={showControls}
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
          handleHideList={() => setShowChromecastOptions(false)}
        />
      </VolumeContext.Provider>
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
      <View>
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
  moduleType: MODULE_TYPES.VOD,
  videoLength: 0
};

MediaPlayer.propTypes = {
  currentProgram: PropTypes.object,
  fullscreen: PropTypes.bool,
  title: PropTypes.string,
  // videoLength: PropTypes.string,
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
