/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { Text, withTheme, ActivityIndicator } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import Slider from '@react-native-community/slider';
import moment from 'moment';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { createFontFormat, toDateTime } from 'utils';
import VerticalSlider from 'rn-vertical-slider';
import { Creators } from 'modules/ducks/movies/movies.actions';
import {
  selectPlaybackInfo,
  // selectCurrentPosition,
  selectCurrentTime,
  selectRemainingTime,
  selectDuration
} from 'modules/ducks/movies/movies.selectors';
import CastButton from 'components/cast-button/cast-button.component';
import { useRemoteMediaClient } from 'react-native-google-cast';
import SystemSetting from 'react-native-system-setting';
import NextButton from './next-button.component';
import PrevButton from './prev-button.component';

const VideoControls = ({
  theme,
  currentTime,
  remainingTime,
  buffering,
  previousAction,
  nextAction,
  isFirstEpisode,
  isLastEpisode,
  multipleMedia,
  duration,
  setVolume,
  isFullscreen,
  source,
  castSessionActive,
  updatePlaybackInfoAction,
  ...controlProps
}) => {
  const [mediaInfo, setMediaInfo] = React.useState(null);
  const client = useRemoteMediaClient();

  React.useEffect(() => {
    const volumeListener = SystemSetting.addVolumeListener((data) => {
      const volume = data.value;
      setVolume(volume);
    });

    return () => SystemSetting.removeVolumeListener(volumeListener);
  }, []);

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

  const getMediaStatus = async () => {
    if (!client) return;
    const { mediaInfo } = await client.getMediaStatus();
    setMediaInfo(mediaInfo);
  };

  const handleSlidingStart = () => {
    controlProps.setPaused(true);
  };

  const handleSlidingComplete = async (position) => {
    if (castSessionActive) {
      if (!client) return;

      await client.seek({ position });
    }

    controlProps.setSliderPosition(position);
    controlProps.setPaused(false);
  };

  const renderVolumeSlider = () => {
    if (castSessionActive) return;

    if (isFullscreen)
      return (
        <Slider
          style={{
            zIndex: 110,
            width: 200,
            position: 'absolute',
            left: -100 + 24,
            top: 150
          }}
          onValueChange={(value) => setVolume(value)}
          value={controlProps.volume}
          minimumValue={0}
          maximumValue={1}
          transform={[{ rotate: '-90deg' }]}
          minimumTrackTintColor={theme.iplayya.colors.white100}
          maximumTrackTintColor={theme.iplayya.colors.white25}
        />
      );

    return (
      <View style={{ position: 'absolute', marginLeft: 20, paddingTop: 40, zIndex: 102 }}>
        <VerticalSlider
          width={8}
          height={isFullscreen ? 250 : 100}
          value={controlProps.volume}
          min={0}
          max={1}
          onChange={(value) => setVolume(parseFloat(value))}
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
          marginBottom: 20
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <Pressable>
            <Icon
              name={controlProps.volume > 0 ? 'volume' : 'volume-off'}
              size={theme.iconSize(3)}
              style={{ marginRight: 15 }}
            />
          </Pressable>
          {/* <Pressable>
              <Icon name="caption" size={25} style={{ marginRight: 15 }} />
            </Pressable> */}
          {controlProps.typename !== 'Iptv' ? (
            <Pressable onPress={() => controlProps.toggleVideoOptions()}>
              <Icon name="video-quality" size={theme.iconSize(3)} />
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
            </Pressable>
          ) : null}
        </View>
        <Pressable onPress={() => controlProps.toggleFullscreen()}>
          <Icon name="fullscreen" size={theme.iconSize(3)} />
        </Pressable>
      </View>
    );
  };

  const renderProgressSlider = () => {
    const timeRemaining = isNaN(remainingTime)
      ? '0:00:00'
      : moment(toDateTime(remainingTime)).format('H:mm:ss');

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1.5 }}>
          <Text style={{ ...createFontFormat(10, 14) }}>
            {moment(toDateTime(currentTime)).format('H:mm:ss')}
          </Text>
        </View>
        <View style={{ flex: 7 }}>
          <Slider
            value={currentTime}
            onSlidingStart={handleSlidingStart}
            onSlidingComplete={(value) => handleSlidingComplete(value)}
            style={{ width: '100%', height: 10 }}
            minimumValue={0}
            maximumValue={duration}
            minimumTrackTintColor={theme.iplayya.colors.vibrantpussy}
            maximumTrackTintColor="white"
          />
        </View>
        <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
          <Text style={{ ...createFontFormat(10, 14) }}>{`-${timeRemaining}`}</Text>
        </View>
      </View>
    );
  };

  const getContentTitle = () => {
    if (castSessionActive) return 'Connected to Google Cast';

    return controlProps.seriesTitle || controlProps.title;
  };

  return (
    <View
      style={{
        backgroundColor: theme.iplayya.colors.black50,
        ...styles.controls,
        ...controlProps.style,
        opacity: controlProps.visible ? 1 : 0
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
          <PrevButton onPress={previousAction} disabled={isFirstEpisode} />
          // <Pressable onPress={() => previousAction()} disabled={isFirstEpisode}>
          //   <Icon
          //     name="previous"
          //     size={theme.iconSize(4)}
          //     style={{ color: isFirstEpisode ? theme.iplayya.colors.white25 : 'white' }}
          //   />
          // </Pressable>
        )}
        <Pressable onPress={() => controlProps.togglePlay()}>
          {buffering ? (
            <ActivityIndicator size="large" style={{ marginHorizontal: 20 }} color="white" />
          ) : (
            <Icon
              name={controlProps.paused ? 'circular-play' : 'circular-pause'}
              size={theme.iconSize(7)}
              style={{ marginHorizontal: 20 }}
            />
          )}
        </Pressable>
        {multipleMedia && (
          <NextButton onPress={nextAction} disabled={isLastEpisode} />
          // <Pressable
          //   style={styles.buttonContainer}
          //   onPress={() => nextAction()}
          //   disabled={isLastEpisode}
          // >
          //   <Icon
          //     name="next"
          //     size={theme.iconSize(4)}
          //     style={{ color: isLastEpisode ? theme.iplayya.colors.white25 : 'white' }}
          //   />
          // </Pressable>
        )}
      </View>

      <View style={{ position: 'relative', zIndex: 101 }}>
        {renderBottomControls()}

        {renderProgressSlider()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  controls: {
    width: Dimensions.get('window').width,
    height: 211,
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
  paused: PropTypes.bool.isRequired,
  multipleMedia: PropTypes.bool,
  toggleVolumeSliderVisible: PropTypes.func,
  updatePlaybackInfoAction: PropTypes.func
};

VideoControls.defaultProps = {
  multipleMedia: false
};

const mapStateToProps = createStructuredSelector({
  playbackInfo: selectPlaybackInfo,
  currentTime: selectCurrentTime,
  remainingTime: selectRemainingTime,
  duration: selectDuration
});

const actions = {
  updatePlaybackInfoAction: Creators.updatePlaybackInfo
};

export default compose(connect(mapStateToProps, actions), withTheme)(VideoControls);
