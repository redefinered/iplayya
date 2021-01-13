/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Pressable, StyleSheet, View, Animated } from 'react-native';
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

const VideoControls = ({
  title,
  seekableDuration,
  currentTime,
  style,
  theme,
  togglePlay,
  toggleFullscreen,
  paused,
  visible
}) => {
  const [timeRemaining, setTimeRemaining] = React.useState(0);

  React.useEffect(() => {
    setTimeRemaining(seekableDuration - currentTime);
  }, [currentTime]);

  // console.log({ playbackInfo, timeRemaining, seekableDuration, currentTime });

  return (
    <Animated.View style={{ ...styles.controls, ...style, opacity: visible ? 1 : 0 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: 'bold', ...createFontFormat(14, 16) }}>{title}</Text>
        <Pressable>
          <Icon name="screen-cast" size={25} />
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Pressable>
          <Icon name="previous" size={35} style={{ color: theme.iplayya.colors.white25 }} />
        </Pressable>
        <Pressable onPress={() => togglePlay()}>
          <Icon
            name={paused ? 'circular-play' : 'circular-pause'}
            size={60}
            style={{ marginHorizontal: 20 }}
          />
        </Pressable>
        <Pressable>
          <Icon name="next" size={35} />
        </Pressable>
      </View>

      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Pressable>
              <Icon name="volume" size={25} style={{ marginRight: 10 }} />
            </Pressable>
            <Pressable>
              <Icon name="caption" size={25} style={{ marginRight: 10 }} />
            </Pressable>
            <Pressable>
              <Icon name="video-quality" size={25} />
            </Pressable>
          </View>
          <Pressable onPress={() => toggleFullscreen()}>
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
          <View style={{ flex: 9 }}>
            <Slider
              value={currentTime}
              style={{ width: '100%', height: 10 }}
              minimumValue={0}
              maximumValue={seekableDuration}
              minimumTrackTintColor={theme.iplayya.colors.vibrantpussy}
              maximumTrackTintColor="white"
            />
          </View>
          <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
            <Text style={{ ...createFontFormat(10, 14) }}>
              {moment(toDateTime(timeRemaining)).format('H:mm:ss')}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  controls: {
    width: Dimensions.get('window').width,
    height: 211,
    padding: 10,
    justifyContent: 'space-between'
  }
});

VideoControls.propTypes = {
  title: PropTypes.string,
  theme: PropTypes.object,
  playbackInfo: PropTypes.object,
  style: PropTypes.object,
  togglePlay: PropTypes.func.isRequired,
  paused: PropTypes.bool.isRequired
};

const mapStateToProps = createStructuredSelector({
  playbackInfo: selectPlaybackInfo,
  seekableDuration: selectSeekableDuration,
  currentTime: selectCurrentTime
});

export default compose(connect(mapStateToProps), withTheme)(VideoControls);
