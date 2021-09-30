/* eslint-disable no-unused-vars */

import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Image, View, Text } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import AlertModal from 'components/alert-modal/alert-modal.component';
import SnackBar from 'components/snackbar/snackbar.component';
import RadioButton from 'components/radio-button/radio-button.component';
import DownloadControls from 'components/download-controls/download-controls.component';
import RetryDownloadButton from './imusic-retry-download-button.component'; // the retry button on the modal that appears when download has failed
import theme from 'common/theme';

const coverplaceholder = require('assets/imusic-placeholder.png');

const ImusicDownloadItem = ({
  item,
  task,
  showRadioButton,
  selected,
  handleItemSelect,
  executeDownload,
  handleStopDownload,
  longPressAction
}) => {
  const [paused, setPaused] = React.useState(false);
  const [isDownloaded, setIsDownloaded] = React.useState(false);
  const [broken, setBroken] = React.useState(false);
  const [progress] = React.useState(0);
  const [showDownloadSuccessModal, setShowDownloadSuccessModal] = React.useState(false);
  const [showStopDownloadModal, setShowStopDownloadModal] = React.useState(false);
  const [showDownloadFailureModal, setShowDownloadFailureModal] = React.useState(false);

  const handlePause = () => {
    if (typeof task === 'undefined') return;

    task.pause();

    setPaused(true);
  };

  const handlePlay = async () => {
    if (typeof task === 'undefined') return;

    await task.resume();

    // setProgress(task.percent * 100);
    setPaused(false);
  };

  const handleRetry = () => {
    setBroken(false);
  };

  const handlePress = () => {
    if (!isDownloaded) return;

    handleItemSelect(item.id);
  };

  const hideStopDownloadModal = () => {
    setShowStopDownloadModal(true);
  };

  const handleHideStopDownloadingModal = () => {
    setShowStopDownloadModal(false);
  };

  const hideDownloadFailureModal = () => {
    setShowDownloadFailureModal(false);
  };

  const confirmStopDownload = () => {
    // stop donwloading task
    task.stop();

    handleStopDownload(item.id);
  };

  const handleLongPress = () => {
    if (!isDownloaded) return;

    longPressAction(item.id);
  };

  const renderRadioButton = () => {
    if (!isDownloaded) return;

    return (
      <View style={{ justifyContent: 'center' }}>
        {showRadioButton && <RadioButton selected={selected} />}
      </View>
    );
  };

  const renderProgress = () => {
    if (isDownloaded) return;
    return (
      <React.Fragment>
        <View
          style={{
            width: (progress * Dimensions.get('window').width) / 100,
            height: 2,
            backgroundColor: theme.iplayya.colors.vibrantpussy,
            position: 'absolute',
            left: 0,
            bottom: 0
          }}
        />
        <View
          style={{
            width: Dimensions.get('window').width,
            height: 2,
            backgroundColor: theme.iplayya.colors.white10,
            position: 'absolute',
            left: 0,
            bottom: 0
          }}
        />
      </React.Fragment>
    );
  };

  return (
    <View>
      <TouchableRipple onPress={handlePress} onLongPress={handleLongPress}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: theme.spacing(2),
            paddingVertical: theme.spacing(1)
          }}
        >
          <Image source={coverplaceholder} style={{ width: 40, height: 40 }} />
          {/* content */}
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              paddingVertical: 3,
              paddingLeft: theme.spacing(1),
              paddingRight: 5
            }}
          >
            <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 14 }}>
              {item.name}
            </Text>
            <Text style={{ fontSize: 12, color: theme.iplayya.colors.white50 }}>
              {`${item.performer} • 4:04 min`}
            </Text>
          </View>

          <DownloadControls
            isDownloaded={isDownloaded}
            broken={broken}
            paused={paused}
            handlePause={handlePause}
            handlePlay={handlePlay}
            handleRetry={handleRetry}
            handleDownloadMovie={executeDownload}
            hideStopDownloadModal={hideStopDownloadModal}
          />

          {renderRadioButton()}
        </View>
      </TouchableRipple>

      {renderProgress()}

      <AlertModal
        iconName="download"
        iconColor={theme.iplayya.colors.vibrantpussy}
        message="An unexpected error has occured. Download is interrupted."
        visible={showDownloadFailureModal}
        hideAction={hideDownloadFailureModal}
        onCancel={hideDownloadFailureModal}
        cancelText="Try later"
        confirmTextCompomponent={() => (
          <RetryDownloadButton
            {...item}
            executeDownload={executeDownload}
            setShowDownloadFailureModal={setShowDownloadFailureModal}
            setBroken={setBroken}
          />
        )}
        confirmAction={handleRetry}
      />

      <AlertModal
        iconName="download"
        iconColor={theme.iplayya.colors.vibrantpussy}
        message={`Are you sure you want to stop downloading "${item.title}"?`}
        visible={showStopDownloadModal}
        hideAction={handleHideStopDownloadingModal}
        onCancel={handleHideStopDownloadingModal}
        confirmText="Confirm"
        confirmAction={confirmStopDownload}
      />
      <SnackBar
        visible={showDownloadSuccessModal}
        iconName="circular-check"
        iconColor={theme.iplayya.colors.success}
        message="Download complete"
      />
    </View>
  );
};

ImusicDownloadItem.propTypes = {
  item: PropTypes.object,
  task: PropTypes.object,
  selected: PropTypes.bool,
  showRadioButton: PropTypes.bool,
  executeDownload: PropTypes.func,
  handleStopDownload: PropTypes.func,
  handleItemSelect: PropTypes.func,
  longPressAction: PropTypes.func
};

export default React.memo(ImusicDownloadItem);
