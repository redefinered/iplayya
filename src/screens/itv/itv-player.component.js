import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import MediaPlayer from 'components/media-player/media-player.component';
import { selectNextChannel, selectPreviousChannel } from 'modules/ducks/itv/itv.selectors';
import { connect } from 'react-redux';
import { MODULE_TYPES } from 'common/globals';

const ItvPlayer = ({
  channel,
  paused,
  source,
  handleNextChannel,
  handlePreviousChannel,
  loading,
  setLoading,
  setPaused,
  handleTogglePlay,
  nextChannel,
  previousChannel,
  fullscreen,
  setFullscreen,
  currentProgram
}) => {
  // console.log({ currentProgram });
  const [isFirstChannel, setIsFirstChannel] = React.useState(false);
  const [isLastChannel, setIsLastChannel] = React.useState(false);

  React.useEffect(() => {
    if (typeof nextChannel === 'undefined') {
      setIsLastChannel(true);
    } else {
      setIsLastChannel(false);
    }
  }, [nextChannel]);

  React.useEffect(() => {
    if (typeof previousChannel === 'undefined') {
      setIsFirstChannel(true);
    } else {
      setIsFirstChannel(false);
    }
  }, [previousChannel]);

  const onNextButtonPress = () => {
    if (typeof nextChannel === 'undefined') return;
    handleNextChannel(nextChannel.id);
  };

  const onPrevButtonPress = () => {
    if (typeof previousChannel === 'undefined') return;
    handlePreviousChannel(previousChannel.id);
  };

  if (!channel) return <View />;

  return (
    <MediaPlayer
      multipleMedia
      title={channel.title}
      currentProgram={currentProgram}
      isSeries={false}
      paused={paused}
      source={source}
      nextAction={onNextButtonPress}
      previousAction={onPrevButtonPress}
      togglePlay={handleTogglePlay}
      loading={loading}
      setLoading={setLoading}
      setPaused={setPaused}
      isFirstEpisode={isFirstChannel}
      isLastEpisode={isLastChannel}
      fullscreen={fullscreen}
      setFullscreen={setFullscreen}
      moduleType={MODULE_TYPES.TV}
    />
  );
};

ItvPlayer.propTypes = {
  channel: PropTypes.object,
  currentProgram: PropTypes.object,
  nextChannel: PropTypes.object,
  previousChannel: PropTypes.object,
  paused: PropTypes.bool,
  source: PropTypes.string,
  handleNextChannel: PropTypes.func,
  handlePreviousChannel: PropTypes.func,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  setPaused: PropTypes.func,
  handleTogglePlay: PropTypes.func,
  fullscreen: PropTypes.bool,
  setFullscreen: PropTypes.func
};

const mapStateToProps = (state, props) => {
  return {
    nextChannel: selectNextChannel(state, props),
    previousChannel: selectPreviousChannel(state, props)
  };
};

export default connect(mapStateToProps)(React.memo(ItvPlayer));
