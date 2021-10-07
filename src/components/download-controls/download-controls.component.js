import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import ButtonClose from './button-close.component';
import ButtonPause from './button-pause.component';
import ButtonRetry from './button-retry.component';

const DownloadControls = ({
  isDownloaded,
  broken,
  paused,
  handlePause,
  handlePlay,
  handleRetry,
  hideStopDownloadModal
}) => {
  if (isDownloaded) return <View />;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <ButtonPause
        broken={broken}
        paused={paused}
        handlePause={handlePause}
        handlePlay={handlePlay}
      />
      <ButtonRetry broken={broken} handlePress={handleRetry} />
      <ButtonClose onPressAction={hideStopDownloadModal} />
    </View>
  );
};

DownloadControls.propTypes = {
  isDownloaded: PropTypes.bool,
  broken: PropTypes.bool,
  paused: PropTypes.bool,
  handlePause: PropTypes.func,
  handlePlay: PropTypes.func,
  handleRetry: PropTypes.func,
  handleDownloadMovie: PropTypes.func,
  hideStopDownloadModal: PropTypes.func
};

export default React.memo(DownloadControls);
