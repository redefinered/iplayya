import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import thumbImage from 'assets/player-thumb-image.png';
import { createStructuredSelector } from 'reselect';
import { selectPlaybackProgress, selectPlaybackInfo } from 'modules/ducks/music/music.selectors';
import { connect } from 'react-redux';
import { createFontFormat, toDateTime } from 'utils';
import { Creators } from 'modules/ducks/music/music.actions';
import moment from 'moment';

const MusicPlayerSlider = ({ progress, playbackInfo, setPauseAction, setSeekvalueAction }) => {
  const theme = useTheme();
  const [value, setValue] = React.useState();
  const [remainingTime, setRemainingTime] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);

  React.useEffect(() => {
    if (progress) setValue(progress);
  }, [progress]);

  const handleChange = (value) => {
    /// formula for progress: (currentTime / seekableDuration) * 100;
    const { seekableDuration } = playbackInfo;

    const currentTime = (value * seekableDuration) / 100;
    const timeRemaining = seekableDuration - currentTime;

    setCurrentTime(moment(toDateTime(currentTime)).format('mm:ss'));
    setRemainingTime(moment(toDateTime(timeRemaining)).format('mm:ss'));

    setValue(value);
  };

  React.useEffect(() => {
    if (!playbackInfo) return setRemainingTime(0);

    /// set currentTime while playback is in progress
    setCurrentTime(moment(toDateTime(playbackInfo.currentTime)).format('mm:ss'));

    const { seekableDuration, currentTime } = playbackInfo;
    const timeRemaining = seekableDuration - currentTime;

    setRemainingTime(moment(toDateTime(timeRemaining)).format('mm:ss'));
  }, [playbackInfo]);

  const renderDuration = () => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
        <Text style={{ ...createFontFormat(10, 14) }}>{currentTime}</Text>
        <Text style={{ ...createFontFormat(10, 14) }}>{`-${remainingTime}`}</Text>
      </View>
    );
  };

  const handleSlidingComplete = (value) => {
    setPauseAction(false);

    setSeekvalueAction((value * playbackInfo.seekableDuration) / 100);
  };

  return (
    <React.Fragment>
      <Slider
        value={value}
        onSlidingStart={() => setPauseAction(true)}
        onSlidingComplete={handleSlidingComplete}
        onValueChange={handleChange}
        minimumValue={0}
        maximumValue={100}
        minimumTrackTintColor={theme.iplayya.colors.vibrantpussy}
        maximumTrackTintColor="white"
        thumbImage={thumbImage}
        style={{ width: '100%', height: 10 }}
      />

      {renderDuration()}
    </React.Fragment>
  );
};

MusicPlayerSlider.propTypes = {
  progress: PropTypes.number,
  playbackInfo: PropTypes.object,
  setPauseAction: PropTypes.func,
  setSeekvalueAction: PropTypes.func
};

const actions = {
  setPauseAction: Creators.setPaused,
  setSeekvalueAction: Creators.setSeekValue
};

const mapStateToProps = createStructuredSelector({
  progress: selectPlaybackProgress,
  playbackInfo: selectPlaybackInfo
});

export default connect(mapStateToProps, actions)(MusicPlayerSlider);
