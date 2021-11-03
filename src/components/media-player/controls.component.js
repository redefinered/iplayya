/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { Text, withTheme, ActivityIndicator, TouchableRipple } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import ButtonIconDefault from 'components/button-icon-default/button-icon-default.component';
import Slider from '@react-native-community/slider';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { createFontFormat } from 'utils';
import MediaPlayerSlider from './media-player-slider.component';
import ChromecastButton from 'components/cast-button/cast-button.component';
import { Creators } from 'modules/ducks/movies/movies.actions';
import {
  selectCurrentTime,
  selectRemainingTime,
  selectDuration
} from 'modules/ducks/movies/movies.selectors';
import GoogleCast, { useRemoteMediaClient } from 'react-native-google-cast';
import NextButton from './next-button.component';
import PrevButton from './prev-button.component';
import volumeThumbTransparent from 'assets/volume-thumb-transparent.png';
import DeviceInfo from 'react-native-device-info';

const VideoControls = ({
  playbackInfo,
  theme,
  buffering,
  previousAction,
  nextAction,
  isFirstEpisode,
  isLastEpisode,
  multipleMedia,
  setVolume,
  isFullscreen,
  castSessionActive,
  // updatePlaybackInfoAction,
  setPlaybackInfo,
  ...controlProps
}) => {
  const sessionManager = GoogleCast.getSessionManager();
  const client = useRemoteMediaClient();
  const [mediaStatus, setMediaStatus] = React.useState(null);
  const [showVolume, setShowVolume] = React.useState(true);
  const [showFullscreenQualityOptions, setShowFullscreenQualityOptions] = React.useState(false);

  React.useEffect(() => {
    if (client) {
      const mediaStatusListener = client.onMediaStatusUpdated((mediaStatus) => {
        if (!mediaStatus) return;

        console.log({ playerStatus: mediaStatus.playerState });

        setMediaStatus(mediaStatus);
      });

      const mediaProgressListener = client.onMediaProgressUpdated((p, d) => {
        controlProps.setPaused(false);

        setPlaybackInfo({ seekableDuration: d, currentTime: p });
      });

      return () => {
        mediaProgressListener.remove();
        mediaStatusListener.remove();
      };
    }
  }, [client]);

  const handleNextButtonPress = () => {
    nextAction();
    controlProps.setShowControls(true);
  };

  const handlePreviousButtonPress = () => {
    previousAction();
    controlProps.setShowControls(true);
  };

  // const handleSlidingStart = () => {
  //   controlProps.setPaused(true);
  // };

  // const handleSlidingComplete = async (position) => {
  //   if (castSessionActive) {
  //     if (!client) return;

  //     await client.seek({ position });
  //   }

  //   controlProps.setSliderPosition(position);
  //   controlProps.setPaused(false);
  // };

  const handleVolumeChange = (volume) => {
    setVolume(parseFloat(volume.toFixed(4)));
    // setSavedVolume(parseFloat(v));
  };

  const toggleVolume = () => {
    /// toggle visibility
    setShowVolume(!showVolume);

    /// toggle value
    // const { volume } = controlProps;
    // if (volume > 0) return setVolume(0);

    // return setVolume(savedVolume);
  };

  const getFullscreenStyle = () => {
    let WIDTH, TOP_OFFSET;

    const SLIDER_WIDTH = 5;
    const ROTATED_TOP_ZERO = 25 + SLIDER_WIDTH;
    const ROTATED_LEFT_ZERO = -25 - SLIDER_WIDTH;

    const V_SLIDER_MARGIN = 10;
    const NORMAL_SCREEN_VIDEO_HEIGHT = 211;

    const { width: SCREEN_WIDTH } = Dimensions.get('window');

    if (isFullscreen) {
      WIDTH = 200;

      const FULLSCREEN_ROTATED_LEFT_ZERO = -65;
      const FULLSCREEN_ROTATED_TOP_ZERO = 80;

      const SCREEN_WIDTH_DIVIDED_BY_TWO = SCREEN_WIDTH / 2;
      const WIDTH_WIDTH_DIVIDED_BY_TWO = WIDTH / 2;

      return {
        width: 200,
        top: FULLSCREEN_ROTATED_TOP_ZERO + SCREEN_WIDTH_DIVIDED_BY_TWO - WIDTH_WIDTH_DIVIDED_BY_TWO,
        left: DeviceInfo.hasNotch()
          ? FULLSCREEN_ROTATED_LEFT_ZERO + 30
          : FULLSCREEN_ROTATED_LEFT_ZERO
      };
    } else {
      WIDTH = 100;
      TOP_OFFSET = NORMAL_SCREEN_VIDEO_HEIGHT / 2 - 15; /// 15 is to nudge the slider a little up ward so it does not ovarlap with the volume button

      return {
        width: 100,
        top: ROTATED_TOP_ZERO + TOP_OFFSET - WIDTH / 2,
        left: ROTATED_LEFT_ZERO + V_SLIDER_MARGIN
      };
    }
  };

  const renderVolumeSlider = () => {
    /// replace thumbimage with a rectangle for easier control
    if (castSessionActive) return;
    if (!showVolume) return;

    return (
      <View
        style={{
          zIndex: 110,
          position: 'absolute',
          // backgroundColor: 'green',
          transform: [{ rotate: '-90deg' }],
          ...getFullscreenStyle()
        }}
      >
        <Slider
          thumbImage={volumeThumbTransparent}
          onValueChange={handleVolumeChange}
          value={controlProps.volume}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor={theme.iplayya.colors.white100}
          maximumTrackTintColor={theme.iplayya.colors.white25}
        />
      </View>
    );
  };

  // const resolutionOptions = () => {
  //   const { resolutions } = controlProps;

  //   // if (typeof resolutions === 'undefined') return;

  //   if (controlProps.showVideoOptions) {
  //     return;
  //   }
  // };

  const handleVideoQualityButtonPress = () => {
    if (isFullscreen) return setShowFullscreenQualityOptions(!showFullscreenQualityOptions);

    controlProps.toggleVideoOptions();
  };

  const renderVideoQualityButton = () => {
    if (!controlProps.qualitySwitchable) return;

    return (
      <View style={{ position: 'relative', zIndex: 111 }}>
        <ButtonIconDefault
          iconName="video-quality"
          pressAction={handleVideoQualityButtonPress}
          iconSize={3}
        />
        {showFullscreenQualityOptions && (
          <View
            style={{
              backgroundColor: '#202530',
              width: 250,
              position: 'absolute',
              bottom: '100%',
              left: 0
            }}
          >
            {controlProps.resolutions.map(({ id, name, label }) => (
              <Pressable
                key={id}
                onPressIn={() => controlProps.setActiveState(name)}
                onPress={() => controlProps.handleSelectResolution(name)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 50,
                  backgroundColor:
                    controlProps.activeState === name
                      ? theme.iplayya.colors.white10
                      : 'transparent',
                  paddingHorizontal: 15
                }}
              >
                <View style={{ flex: 10.5 }}>
                  <Text
                    style={{
                      color:
                        controlProps.resolution === name
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
          </View>
        )}
      </View>
    );
  };

  const renderBottomControls = () => {
    if (castSessionActive) return;

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 111,
          marginBottom: -10
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <ButtonIconDefault
            iconName={controlProps.volume > 0 ? 'volume' : 'volume-off'}
            pressAction={toggleVolume}
            iconSize={3}
          />

          {renderVideoQualityButton()}
        </View>
        <ButtonIconDefault
          iconName={isFullscreen ? 'normal-screen' : 'fullscreen'}
          pressAction={controlProps.toggleFullscreen}
          iconSize={3}
        />
        {/* <Pressable onPress={() => controlProps.toggleFullscreen()}>
          <Icon name="fullscreen" size={theme.iconSize(3)} />
        </Pressable> */}
      </View>
    );
  };

  const renderProgressSlider = () => {
    return (
      <View
        style={{ flexDirection: 'row', alignItems: 'center', position: 'relative', zIndex: 105 }}
      >
        <MediaPlayerSlider
          playbackInfo={playbackInfo}
          setPausedAction={controlProps.setPaused}
          setSliderPosition={controlProps.setSliderPosition}
        />
      </View>
    );
  };

  const getContentTitle = () => {
    if (castSessionActive) return 'Connected to chromecast';

    return controlProps.seriesTitle || controlProps.title;
  };

  const setConditionalStyle = () => {
    if (isFullscreen) return styles.containerStyleFullScreen;
    return styles.containerStyle;
  };

  const handleStopCasting = async () => {
    // console.log('stopping....', { sessionManager });
    await sessionManager.endCurrentSession(true);
  };

  const renderCastButton = () => {
    const { title, seriesTitle, source } = controlProps;
    return (
      <ChromecastButton
        title={title || seriesTitle}
        subtitle="Test subtitle"
        source={source}
        showListAction={() => controlProps.setShowChromecastOptions(true)}
        stopCastingAction={handleStopCasting}
        style={{ width: 24, height: 24 }}
      />
    );
  };

  const handlePlayButtonPress = async () => {
    if (castSessionActive) {
      if (!client) return;
      if (!mediaStatus) return;
      /// pause media if already playing
      if (mediaStatus.playerState === 'playing') return await client.pause();

      return await client.play();
    }

    controlProps.togglePlay();
  };

  const renderPlayButton = () => {
    if (!mediaStatus)
      return (
        <Icon
          name={controlProps.paused ? 'circular-play' : 'circular-pause'}
          size={theme.iconSize(7)}
        />
      );

    if (buffering)
      return <ActivityIndicator size="large" style={{ marginHorizontal: 20 }} color="white" />;

    if (castSessionActive) {
      return (
        <Icon
          name={mediaStatus.playerState === 'playing' ? 'circular-pause' : 'circular-play'}
          size={theme.iconSize(7)}
        />
      );
    }

    return (
      <Icon
        name={controlProps.paused ? 'circular-play' : 'circular-pause'}
        size={theme.iconSize(7)}
      />
    );
  };

  const handleControlsPress = () => {
    /// prevents the conrtols from hiding when white spaces are pressed
    if (castSessionActive) return;

    controlProps.setShowControls(false);
  };

  if (!controlProps.visible) return <View />;

  return (
    <Pressable
      onPress={handleControlsPress}
      style={{
        backgroundColor: theme.iplayya.colors.black50,
        opacity: controlProps.visible ? 1 : 0,
        ...controlProps.style,
        ...setConditionalStyle()
      }}
    >
      {/* volume slider */}
      {renderVolumeSlider()}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 101
        }}
      >
        <Text style={{ fontWeight: 'bold', ...createFontFormat(14, 16) }}>{getContentTitle()}</Text>

        {renderCastButton()}

        {/* <View style={{ flexDirection: 'row' }}>
          {castSession && (
            <ButtonIconDefault iconName="close" iconSize={3} pressAction={handleStopCasting} />
          )}
          <ButtonIconDefault
            iconName={castConnected ? 'cast-connected' : 'cast'}
            iconSize={3}
            pressAction={() => controlProps.setShowChromecastOptions(true)}
          />
        </View> */}
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          // marginTop: 10,
          position: 'relative',
          zIndex: 100
        }}
      >
        {multipleMedia && (
          <PrevButton onPress={handlePreviousButtonPress} disabled={isFirstEpisode} />
        )}
        <TouchableRipple
          borderless
          onPress={handlePlayButtonPress}
          style={{
            width: 60,
            height: 60,
            borderRadius: 60,
            justifyContent: 'center',
            alignItems: 'center'
            // backgroundColor: 'red'
          }}
        >
          <React.Fragment>{renderPlayButton()}</React.Fragment>
        </TouchableRipple>
        {multipleMedia && <NextButton onPress={handleNextButtonPress} disabled={isLastEpisode} />}
      </View>

      <View style={{ position: 'relative', zIndex: 111 }}>
        {renderBottomControls()}

        {renderProgressSlider()}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    width: Dimensions.get('window').width,
    height: 211,
    padding: 10,
    paddingBottom: 0,
    justifyContent: 'space-between',
    zIndex: 99
    // backgroundColor: 'red'
  },
  containerStyleFullScreen: {
    width: Dimensions.get('window').height,
    height: Dimensions.get('window').width,
    padding: 10,
    justifyContent: 'space-between',
    zIndex: 99
  },
  buttonContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

VideoControls.propTypes = {
  buffering: PropTypes.bool,
  title: PropTypes.string,
  volume: PropTypes.number,
  theme: PropTypes.object,
  playbackInfo: PropTypes.object,
  style: PropTypes.object,
  togglePlay: PropTypes.func.isRequired,
  multipleMedia: PropTypes.bool,
  toggleVolumeSliderVisible: PropTypes.func,
  updatePlaybackInfoAction: PropTypes.func
};

VideoControls.defaultProps = {
  multipleMedia: false,
  qualitySwitchable: false
};

const mapStateToProps = createStructuredSelector({
  currentTime: selectCurrentTime,
  remainingTime: selectRemainingTime,
  duration: selectDuration
});

const actions = {
  updatePlaybackInfoAction: Creators.updatePlaybackInfo
};

export default compose(connect(mapStateToProps, actions), withTheme)(VideoControls);
