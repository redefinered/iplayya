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
import castOptions from './screencast-options.json';
import { createFontFormat, toDateTime } from 'utils';
import {
  selectPlaybackInfo,
  // selectCurrentPosition,
  selectCurrentTime,
  selectRemainingTime,
  selectDuration
} from 'modules/ducks/movies/movies.selectors';

// const thumbimage = require('assets/media-player-slider-thumb.png');

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
  ...controlProps
}) => {
  // console.log('xxxx', duration);
  // const [progress, setProgress] = React.useState(0);

  const handleSlidingStart = () => {
    controlProps.setPaused(true);
  };

  const handleSlidingComplete = (value) => {
    controlProps.setSliderPosition(value);
    controlProps.setPaused(false);
  };

  // React.useEffect(() => {
  //   setProgress(currentTime);
  // }, [currentTime]);

  // console.log('duration', duration);
  const screencastOptions = () => {
    if (controlProps.showCastOptions) {
      return castOptions.map(({ id, name, label }) => (
        <Pressable
          key={id}
          onPressIn={() => controlProps.setScreencastActiveState(name)}
          onPress={() => controlProps.handleSelectScreencastOption(name)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 50,
            backgroundColor:
              controlProps.screencastActiveState === name
                ? theme.iplayya.colors.white10
                : 'transparent',
            paddingHorizontal: 15
          }}
        >
          <View style={{ flex: 1.5 }}>
            <Icon name="airplay" size={20} />
          </View>
          <View style={{ flex: 10.5, paddingLeft: 15 }}>
            <Text
              style={{
                color:
                  controlProps.screencastOption === name
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

  return (
    <View
      style={{
        backgroundColor: theme.iplayya.colors.black50,
        ...styles.controls,
        ...controlProps.style,
        opacity: controlProps.visible ? 1 : 0
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 101
        }}
      >
        <Text style={{ fontWeight: 'bold', ...createFontFormat(14, 16) }}>
          {controlProps.seriesTitle || controlProps.title}
        </Text>
        <Pressable
          onPress={() => controlProps.toggleCastOptions()}
          style={{ position: 'relative' }}
        >
          <Icon name="screencast" size={25} />

          <View
            style={{
              backgroundColor: '#202530',
              width: 250,
              position: 'absolute',
              top: '100%',
              right: 0
            }}
          >
            {screencastOptions()}
          </View>
        </Pressable>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 10,
          position: 'relative',
          zIndex: 100
        }}
      >
        {multipleMedia && (
          <Pressable onPress={() => previousAction()} disabled={isFirstEpisode}>
            <Icon
              name="previous"
              size={35}
              style={{ color: isFirstEpisode ? theme.iplayya.colors.white25 : 'white' }}
            />
          </Pressable>
        )}
        <Pressable onPress={() => controlProps.togglePlay()}>
          {buffering ? (
            <ActivityIndicator size="large" style={{ marginHorizontal: 20 }} color="white" />
          ) : (
            <Icon
              name={controlProps.paused ? 'circular-play' : 'circular-pause'}
              size={60}
              style={{ marginHorizontal: 20 }}
            />
          )}
        </Pressable>
        {multipleMedia && (
          <Pressable onPress={() => nextAction()} disabled={isLastEpisode}>
            <Icon
              name="next"
              size={35}
              style={{ color: isLastEpisode ? theme.iplayya.colors.white25 : 'white' }}
            />
          </Pressable>
        )}
      </View>

      <View style={{ position: 'relative', zIndex: 101 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Pressable onPress={() => controlProps.toggleVolumeSliderVisible()}>
              <Icon
                name={controlProps.volume > 0 ? 'volume' : 'volume-off'}
                size={25}
                style={{ marginRight: 15 }}
              />
            </Pressable>
            {/* <Pressable>
              <Icon name="caption" size={25} style={{ marginRight: 15 }} />
            </Pressable> */}
            {controlProps.typename === 'SingleVideo' ? (
              <Pressable onPress={() => controlProps.toggleVideoOptions()}>
                <Icon name="video-quality" size={25} />
              </Pressable>
            ) : null}
          </View>
          <Pressable onPress={() => controlProps.toggleFullscreen()}>
            <Icon name="fullscreen" size={25} />
          </Pressable>
        </View>

        {/* video progress */}
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
              // thumbImage={thumbimage}
            />
          </View>
          <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
            <Text style={{ ...createFontFormat(10, 14) }}>
              {`-${moment(toDateTime(remainingTime)).format('H:mm:ss')}`}
            </Text>
          </View>
        </View>
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
  toggleCastOptions: PropTypes.func,
  toggleVideoOptions: PropTypes.func,
  showCastOptions: PropTypes.bool
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

export default compose(connect(mapStateToProps), withTheme)(VideoControls);
