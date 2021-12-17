/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { Text, withTheme, ActivityIndicator, TouchableRipple } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import ButtonIconDefault from 'components/button-icon-default/button-icon-default.component';
// import Slider from '@react-native-community/slider';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { createFontFormat } from 'utils';
import MediaPlayerSlider from './media-player-slider.component';
import CastButton from 'components/cast-button/cast-button.component';
import { Creators } from 'modules/ducks/movies/movies.actions';
import {
  selectCurrentTime,
  selectRemainingTime,
  selectDuration
} from 'modules/ducks/movies/movies.selectors';
import GoogleCast, { useRemoteMediaClient } from 'react-native-google-cast';
import NextButton from './next-button.component';
import PrevButton from './prev-button.component';
// import volumeThumbTransparent from 'assets/volume-thumb-transparent.png';
import VolumeSlider from './volume-slider.component';
// import DeviceInfo from 'react-native-device-info';
import CastOptions from './cast-options.component';
import { MODULE_TYPES } from 'common/globals';

const VideoControls = ({
  playbackInfo,
  theme,
  buffering,
  previousAction,
  nextAction,
  isFirstEpisode,
  isLastEpisode,
  multipleMedia,
  // setVolume,
  isFullscreen,
  castSessionActive,
  // updatePlaybackInfoAction,
  setPlaybackInfo,
  ...controlProps
}) => {
  const sessionManager = GoogleCast.getSessionManager();
  const discoveryManager = GoogleCast.getDiscoveryManager();
  const client = useRemoteMediaClient();
  const [mediaStatus, setMediaStatus] = React.useState(null);
  const [showVolume, setShowVolume] = React.useState(true);
  const [showFullscreenQualityOptions, setShowFullscreenQualityOptions] = React.useState(false);
  const [showFullscreenCastOptions, setShowFullscreenCastOptions] = React.useState(false);

  /// hide fullscreen screencast options when exiting fullscreen
  React.useEffect(() => {
    if (!isFullscreen) setShowFullscreenCastOptions(false);
  }, [isFullscreen]);

  React.useEffect(() => {
    if (client) {
      const mediaStatusListener = client.onMediaStatusUpdated((mediaStatus) => {
        if (!mediaStatus) return;

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

  // const handleVolumeChange = (volume) => {
  //   setVolume(parseFloat(volume.toFixed(4)));
  //   // setSavedVolume(parseFloat(v));
  // };

  const toggleVolume = () => {
    /// toggle visibility
    setShowVolume(!showVolume);

    /// toggle value
    // const { volume } = controlProps;
    // if (volume > 0) return setVolume(0);

    // return setVolume(savedVolume);
  };

  const renderVolumeSlider = () => {
    /// replace thumbimage with a rectangle for easier control
    if (castSessionActive) return;
    if (!showVolume) return;

    return <VolumeSlider isFullscreen={isFullscreen} />;
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
    if (castSessionActive) {
      if (!isFullscreen) return;

      return (
        <View
          style={{
            position: 'relative',
            zIndex: 111,
            marginBottom: controlProps.moduleType === MODULE_TYPES.TV ? 0 : -10
          }}
        >
          <View style={{ alignSelf: 'flex-end' }}>
            <ButtonIconDefault
              iconName={isFullscreen ? 'normal-screen' : 'fullscreen'}
              pressAction={controlProps.toggleFullscreen}
              iconSize={3}
            />
          </View>
        </View>
      );
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 111,
          marginBottom: controlProps.moduleType === MODULE_TYPES.TV ? 0 : -10
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
      </View>
    );
  };

  const renderProgressSlider = () => {
    /// hide progress slider in TV
    if (controlProps.moduleType === MODULE_TYPES.TV) return;

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

  const handleCastButtonPress = () => {
    discoveryManager.startDiscovery();

    if (isFullscreen) return setShowFullscreenCastOptions(!showFullscreenCastOptions);

    controlProps.setShowChromecastOptions(true);
  };

  const renderCastButton = () => {
    const { title, seriesTitle, source } = controlProps;
    return (
      <View style={{ position: 'relative', zIndex: 111 }}>
        <CastButton
          title={title || seriesTitle}
          subtitle="Test subtitle"
          source={source}
          onPressAction={handleCastButtonPress}
          stopCastingAction={handleStopCasting}
          style={{ width: 24, height: 24 }}
        />

        {/* fullscreen cast options container */}
        {showFullscreenCastOptions && (
          <View
            style={{
              backgroundColor: '#202530',
              width: 250,
              position: 'absolute',
              top: '100%',
              right: 0
            }}
          >
            <CastOptions handleHideList={controlProps.handleHideList} />
          </View>
        )}
      </View>
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
