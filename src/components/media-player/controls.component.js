import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import Slider from '@react-native-community/slider';
import moment from 'moment';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectPlaybackInfo,
  selectSeekableDuration,
  selectCurrentTime
} from 'modules/ducks/movies/movies.selectors';

import { createFontFormat } from 'utils';

function toDateTime(secs) {
  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs);
  return t;
}

const VideoControls = ({ theme, ...controlProps }) => {
  const [timeRemaining, setTimeRemaining] = React.useState(0);

  React.useEffect(() => {
    setTimeRemaining(controlProps.seekableDuration - controlProps.currentTime);
  }, [controlProps.currentTime]);

  // console.log({ playbackInfo, timeRemaining, seekableDuration, currentTime });

  return (
    <View
      style={{ ...styles.controls, ...controlProps.style, opacity: controlProps.visible ? 1 : 0 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: 'bold', ...createFontFormat(14, 16) }}>
          {controlProps.loading ? 'loading...' : controlProps.title}
        </Text>
        <Pressable onPress={() => controlProps.toggleCastOptions()}>
          <Icon name="screencast" size={25} />
        </Pressable>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 10
        }}
      >
        {controlProps.multipleMedia ? (
          <Pressable>
            <Icon name="previous" size={35} style={{ color: theme.iplayya.colors.white25 }} />
          </Pressable>
        ) : null}
        <Pressable onPress={() => controlProps.togglePlay()}>
          <Icon
            name={controlProps.paused ? 'circular-play' : 'circular-pause'}
            size={60}
            style={{ marginHorizontal: 20 }}
          />
        </Pressable>
        {controlProps.multipleMedia ? (
          <Pressable>
            <Icon name="next" size={35} />
          </Pressable>
        ) : null}
      </View>

      <View>
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
            <Pressable onPress={() => controlProps.toggleVideoOptions()}>
              <Icon name="video-quality" size={25} />
            </Pressable>
          </View>
          <Pressable onPress={() => controlProps.toggleFullscreen()}>
            <Icon name="fullscreen" size={25} />
          </Pressable>
        </View>

        {/* video progress */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1.5 }}>
            <Text style={{ ...createFontFormat(10, 14) }}>
              {moment(toDateTime(controlProps.currentTime)).format('H:mm:ss')}
            </Text>
          </View>
          <View style={{ flex: 9 }}>
            <Slider
              value={controlProps.currentTime}
              onSlidingComplete={(value) => controlProps.setCurrentTime(value)}
              style={{ width: '100%', height: 10 }}
              minimumValue={0}
              maximumValue={controlProps.seekableDuration}
              minimumTrackTintColor={theme.iplayya.colors.vibrantpussy}
              maximumTrackTintColor="white"
            />
          </View>
          <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
            <Text style={{ ...createFontFormat(10, 14) }}>
              {`-${moment(toDateTime(timeRemaining)).format('H:mm:ss')}`}
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
  toggleVideoOptions: PropTypes.func
};

VideoControls.defaultProps = {
  multipleMedia: false
};

const mapStateToProps = createStructuredSelector({
  playbackInfo: selectPlaybackInfo,
  seekableDuration: selectSeekableDuration,
  currentTime: selectCurrentTime
});

export default compose(connect(mapStateToProps), withTheme)(VideoControls);
