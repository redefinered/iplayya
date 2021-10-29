import React from 'react';
import PropTypes from 'prop-types';
import MediaPlayer from 'components/media-player/media-player.component';
import { selectNextChannel, selectPreviousChannel } from 'modules/ducks/isports/isports.selectors';
import { connect } from 'react-redux';

const IsportsPlayer = ({
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
  setFullscreen
}) => {
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
  return (
    <MediaPlayer
      multipleMedia
      isSeries={false}
      paused={paused}
      source={source}
      nextAction={onNextButtonPress}
      previousAction={onPrevButtonPress}
      togglePlay={handleTogglePlay}
      loading={loading}
      setLoading={setLoading}
      typename={channel.__typename}
      setPaused={setPaused}
      isFirstEpisode={isFirstChannel}
      isLastEpisode={isLastChannel}
      fullscreen={fullscreen}
      setFullscreen={setFullscreen}
    />
  );
};

IsportsPlayer.propTypes = {
  channel: PropTypes.object,
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

export default connect(mapStateToProps)(React.memo(IsportsPlayer));
