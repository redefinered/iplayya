import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
// import Slider from 'react-native-slider';
import Slider from '@react-native-community/slider';
import thumbImage from 'assets/player-thumb-image.png';
import thumbImagePressed from 'assets/player-thumb-image-active.png';
import thumbImageNoMargin from 'assets/player-thumb-image-no-margin.png';
import { createStructuredSelector } from 'reselect';
import { selectPlaybackProgress } from 'modules/ducks/music/music.selectors';
import { connect } from 'react-redux';
import { createFontFormat, toDateTime } from 'utils';
import { Creators } from 'modules/ducks/music/music.actions';
import moment from 'moment';
import theme from 'common/theme';

const MediaPlayerSlider = ({ playbackInfo, setPausedAction, setSliderPosition }) => {
  const [value, setValue] = React.useState();
  const [remainingTime, setRemainingTime] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [thumb, setThumb] = React.useState(thumbImage);
  const [isSliding, setIsSliding] = React.useState(false);

  React.useEffect(() => {
    if (isSliding) {
      setThumb(thumbImagePressed);
    } else {
      if (value <= 20) {
        setThumb(thumbImageNoMargin);
      } else if (value >= 80) {
        setThumb(thumbImageNoMargin);
      } else {
        setThumb(thumbImage);
      }
    }
  }, [value, isSliding]);

  React.useEffect(() => {
    if (playbackInfo) {
      const { seekableDuration, currentTime } = playbackInfo;

      let percentage = (currentTime / seekableDuration) * 100;

      percentage = percentage === Infinity ? 0 : percentage;
      percentage = isNaN(percentage) ? 0 : percentage;

      setValue(percentage);
    }
  }, [playbackInfo]);

  const handleChange = (value) => {
    if (!playbackInfo) return;
    /// formula for progress: (currentTime / seekableDuration) * 100;
    const { seekableDuration } = playbackInfo;

    const currentTime = (value * seekableDuration) / 100;
    const timeRemaining = seekableDuration - currentTime;

    setCurrentTime(moment(toDateTime(currentTime)).format('H:mm:ss'));
    setRemainingTime(moment(toDateTime(timeRemaining)).format('H:mm:ss'));

    setValue(value);
  };

  React.useEffect(() => {
    if (!playbackInfo) return setRemainingTime(0);

    /// set currentTime while playback is in progress
    setCurrentTime(moment(toDateTime(playbackInfo.currentTime)).format('H:mm:ss'));

    const { seekableDuration, currentTime } = playbackInfo;
    const timeRemaining = seekableDuration - currentTime;

    setRemainingTime(moment(toDateTime(timeRemaining)).format('H:mm:ss'));
  }, [playbackInfo]);

  const handleSlidingComplete = () => {
    setIsSliding(false);

    if (!playbackInfo) return;

    setPausedAction(false);
    setSliderPosition((value * playbackInfo.seekableDuration) / 100);
  };

  const handleSlidingStart = () => {
    setIsSliding(true);
    setPausedAction(true);
  };

  const renderCurrentTime = () => {
    if (!currentTime) return <Text style={{ ...createFontFormat(10, 14) }}>0:00:00</Text>;
    return <Text style={{ ...createFontFormat(10, 14) }}>{currentTime}</Text>;
  };

  const renderRemainingTime = () => {
    if (!remainingTime) return <Text style={{ ...createFontFormat(10, 14) }}>0:00:00</Text>;
    return <Text style={{ ...createFontFormat(10, 14) }}>{remainingTime}</Text>;
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ flex: 1.5 }}>{renderCurrentTime()}</View>
      <View style={{ flex: 7 }}>
        <Slider
          value={value}
          onSlidingStart={handleSlidingStart}
          onSlidingComplete={handleSlidingComplete}
          onValueChange={handleChange}
          minimumValue={0}
          maximumValue={100}
          minimumTrackTintColor={theme.iplayya.colors.vibrantpussy}
          maximumTrackTintColor={theme.iplayya.colors.white25}
          thumbImage={thumb}
          style={{ width: '100%' }}
        />
      </View>
      <View style={{ flex: 1.5, alignItems: 'flex-end' }}>{renderRemainingTime()}</View>
    </View>
  );
};

MediaPlayerSlider.propTypes = {
  progress: PropTypes.number,
  playbackInfo: PropTypes.object,
  setPausedAction: PropTypes.func,
  setSeekvalueAction: PropTypes.func,
  setSliderPosition: PropTypes.func
};

const actions = {
  setSeekvalueAction: Creators.setSeekValue
};

const mapStateToProps = createStructuredSelector({
  progress: selectPlaybackProgress
});

export default connect(mapStateToProps, actions)(React.memo(MediaPlayerSlider));
