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
import { Creators } from 'modules/ducks/movies/movies.actions';
import {
  selectCurrentTime,
  selectRemainingTime,
  selectDuration
} from 'modules/ducks/movies/movies.selectors';
import CastButton from 'components/cast-button/cast-button.component';
import { useRemoteMediaClient } from 'react-native-google-cast';
// import SystemSetting from 'react-native-system-setting';
import NextButton from './next-button.component';
import PrevButton from './prev-button.component';
// import volumeThumb from 'assets/volume-thumb.png';
import volumeThumbTransparent from 'assets/volume-thumb-transparent.png';
import DeviceInfo from 'react-native-device-info';

const VideoControls = ({
  playbackInfo,
  theme,
  currentTime,
  buffering,
  previousAction,
  nextAction,
  isFirstEpisode,
  isLastEpisode,
  multipleMedia,
  setVolume,
  isFullscreen,
  source,
  castSessionActive,
  updatePlaybackInfoAction,
  ...controlProps
}) => {
  const [mediaInfo, setMediaInfo] = React.useState(null);
  const [showVolume, setShowVolume] = React.useState(true);
  const client = useRemoteMediaClient();

  React.useEffect(() => {
    if (client) {
      getMediaStatus();
    }
  }, [client]);

  React.useEffect(() => {
    if (client) {
      if (!mediaInfo) return;
      const { streamDuration } = mediaInfo;
      const { setPaused } = controlProps;
      client.onMediaProgressUpdated((streamPosition) => {
        setPaused(false);
        updatePlaybackInfoAction({
          playbackInfo: { seekableDuration: streamDuration, currentTime: streamPosition }
        });
      });
    }
  });

  const handleNextButtonPress = () => {
    nextAction();
    controlProps.setShowControls(true);
  };

  const handlePreviousButtonPress = () => {
    previousAction();
    controlProps.setShowControls(true);
  };

  const getMediaStatus = async () => {
    if (!client) return;
    const { mediaInfo } = await client.getMediaStatus();
    setMediaInfo(mediaInfo);
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

  const resolutionOptions = () => {
    const { resolutions } = controlProps;

    if (typeof resolutions === 'undefined') return;

    if (controlProps.showVideoOptions) {
      return resolutions.map(({ id, name, label }) => (
        <Pressable
          key={id}
          onPressIn={() => controlProps.setActiveState(name)}
          onPress={() => controlProps.handleSelectResolution(name)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 50,
            backgroundColor:
              controlProps.activeState === name ? theme.iplayya.colors.white10 : 'transparent',
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
      ));
    }
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
          zIndex: 104,
          marginBottom: -10
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <ButtonIconDefault
            iconName={controlProps.volume > 0 ? 'volume' : 'volume-off'}
            pressAction={toggleVolume}
            iconSize={3}
          />
          {controlProps.qualitySwitchable ? (
            <React.Fragment>
              <ButtonIconDefault
                iconName="video-quality"
                pressAction={controlProps.toggleVideoOptions}
                iconSize={3}
              />
              <View
                style={{
                  backgroundColor: '#202530',
                  width: 250,
                  position: 'absolute',
                  bottom: '100%',
                  left: 0
                }}
              >
                {resolutionOptions()}
              </View>
            </React.Fragment>
          ) : null}
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
    if (castSessionActive) return 'Connected to Google Cast';

    return controlProps.seriesTitle || controlProps.title;
  };

  const setConditionalStyle = () => {
    if (isFullscreen) return styles.containerStyleFullScreen;
    return styles.containerStyle;
  };

  if (!controlProps.visible) return <View />;

  return (
    <Pressable
      onPress={() => controlProps.setShowControls(false)}
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

        <CastButton
          style={{ width: 24, height: 24 }}
          source={source}
          currentTime={currentTime}
          seriesTitle={controlProps.seriesTitle}
        />
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
          onPress={() => controlProps.togglePlay()}
          style={{
            width: 60,
            height: 60,
            borderRadius: 60,
            justifyContent: 'center',
            alignItems: 'center'
            // backgroundColor: 'red'
          }}
        >
          {buffering ? (
            <ActivityIndicator size="large" style={{ marginHorizontal: 20 }} color="white" />
          ) : (
            <Icon
              name={controlProps.paused ? 'circular-play' : 'circular-pause'}
              size={theme.iconSize(7)}
              // style={{ marginHorizontal: 20 }}
            />
          )}
        </TouchableRipple>
        {multipleMedia && <NextButton onPress={handleNextButtonPress} disabled={isLastEpisode} />}
      </View>

      <View style={{ position: 'relative', zIndex: 101 }}>
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
