import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, View, Image, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import RadioButton from 'components/radio-button/radio-button.component';
import { createFontFormat } from 'utils';
import AlertModal from 'components/alert-modal/alert-modal.component';
import SnackBar from 'components/snackbar/snackbar.component';
import theme from 'common/theme';
import DownloadControls from 'components/download-controls/download-controls.component';
import RetryDownloadButton from './retry-download-button.component'; // the retry button on the modal that appears when download has failed
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/imovie-downloads/imovie-downloads.actions';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { selectDownloadsProgress } from 'modules/ducks/imovie-downloads/imovie-downloads.selectors';
import { selectIsConnected } from 'modules/app';

const DownloadItem = ({
  id,
  title,
  ep,
  year,
  time,
  rating_mpaa,
  age_rating,
  category,
  handleSelectItem,
  imageUrl: uri,
  task,
  longPressAction,
  activateCheckboxes,
  selectedItems,
  handleStopDownload,
  handleDownloadMovie,
  downloadProgress,
  updateDownloadsProgressAction,
  isConnected
}) => {
  const [paused, setPaused] = React.useState(false);
  const [isDownloaded, setIsDownloaded] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [broken, setBroken] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);
  const [showDownloadSuccessModal, setShowDownloadSuccessModal] = React.useState(false);
  const [showStopDownloadModal, setShowStopDownloadModal] = React.useState(false);
  const [showDownloadFailureModal, setShowDownloadFailureModal] = React.useState(false);

  React.useEffect(() => {
    if (downloadProgress.length) {
      const p = downloadProgress.find(({ id: pid }) => pid === id);

      if (typeof p !== 'undefined') setProgress(p.progress);
    }
  }, [downloadProgress]);

  React.useEffect(() => {
    if (progress === 100) {
      if (isDownloaded) return;
      setShowDownloadSuccessModal(true);
      setIsDownloaded(true);
    }
  }, [progress]);

  /// modifies state on taks changes
  React.useEffect(() => {
    if (typeof task === 'undefined') return setIsDownloaded(true);
    if (task.state === 'PAUSED') return setPaused(true);
    if (task.state === 'PENDING') return setPaused(true);
    if (task.state === 'FAILED') return setBroken(true);
    if (task.state === 'DONE') return setIsDownloaded(true);

    // setProgress(task.percent * 100);
    task
      .progress((percent) => {
        updateDownloadsProgressAction({ id, progress: percent * 100 });
      })
      .done(() => {
        setIsDownloaded(true);
        setShowDownloadSuccessModal(true);
        console.log('Download is done!');
      })
      .error((error) => {
        setIsDownloaded(false);
        setBroken(true);
        setShowDownloadFailureModal(true);
        console.log('Download canceled due to error: ', error);
      });
    // setPaused(false);

    setIsDownloaded(false);
  }, [task]);

  // hide download success modal if true
  React.useEffect(() => {
    if (showDownloadSuccessModal) hideSnackBar();
  }, [showDownloadSuccessModal]);

  React.useEffect(() => {
    if (isConnected) {
      setBroken(false);
      setShowDownloadFailureModal(false);
    } else {
      setBroken(true);
      setShowDownloadFailureModal(true);
    }
  }, [isConnected]);

  const hideSnackBar = () => {
    setTimeout(() => {
      setShowDownloadSuccessModal(false);
    }, 3000);
  };

  const handleRetry = () => {
    setBroken(false);
  };

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

  const hideStopDownloadModal = () => {
    setShowStopDownloadModal(true);
  };

  const renderRadioButton = () => {
    if (!isDownloaded) return;

    return (
      <View style={{ justifyContent: 'center' }}>
        {activateCheckboxes && (
          <RadioButton selected={selectedItems.findIndex((i) => i === id) >= 0} />
        )}
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

  const handlePress = () => {
    if (!isDownloaded) return;

    handleSelectItem(id);
  };

  const handleHideStopDownloadingModal = () => {
    setShowStopDownloadModal(false);
  };

  const confirmStopDownload = () => {
    // stop donwloading task
    task.stop();

    handleStopDownload(id);
  };

  const hideDownloadFailureModal = () => {
    setShowDownloadFailureModal(false);
  };

  // const renderDownloadErrorModal = () => {
  //   if (!broken) return;

  //   return (

  //   );
  // };

  const handleLongPress = (id) => {
    if (!isDownloaded) return;

    longPressAction(id);
  };

  return (
    <View
      style={{
        marginBottom: theme.spacing(3),
        backgroundColor: 'transparent'
      }}
    >
      <Pressable
        onPressIn={() => setIsPressed(true)} // replicates TouchableHighlight
        onPressOut={() => setIsPressed(false)} // replicates TouchableHighlight
        style={{
          opacity: isDownloaded ? 1 : 0.5,
          padding: theme.spacing(2),
          flexDirection: 'row',
          backgroundColor: isPressed ? theme.iplayya.colors.white10 : 'transparent'
        }}
        onLongPress={() => handleLongPress(id)}
        onPress={handlePress}
      >
        <Image
          style={{
            marginRight: theme.spacing(2),
            width: 65,
            height: 96,
            borderRadius: 8
          }}
          source={{ uri }}
        />

        {/* content */}
        <View style={{ flex: 1, height: 96, justifyContent: 'center' }}>
          {/* title */}
          <Text
            numberOfLines={1}
            style={{
              fontWeight: '700',
              marginBottom: 5,
              ...createFontFormat(16, 22)
            }}
          >
            {`${title} ${ep}`}
          </Text>

          {/* year and duration */}
          <Text
            numberOfLines={1}
            style={{
              ...createFontFormat(12, 16),
              color: theme.iplayya.colors.white50,
              marginBottom: 5
            }}
          >
            {`${year}, ${Math.floor(time / 60)}h ${time % 60}m`}
          </Text>

          {/* ratings */}
          <Text
            numberOfLines={1}
            style={{
              ...createFontFormat(12, 16),
              color: theme.iplayya.colors.white50,
              marginBottom: 5
            }}
          >
            {`${rating_mpaa}-${age_rating}, ${category}`}
          </Text>
        </View>

        <DownloadControls
          isDownloaded={isDownloaded}
          broken={broken}
          paused={paused}
          handlePause={handlePause}
          handlePlay={handlePlay}
          handleRetry={handleRetry}
          handleDownloadMovie={handleDownloadMovie}
          hideStopDownloadModal={hideStopDownloadModal}
        />

        {/* radtio buttons for selection */}
        {renderRadioButton()}
      </Pressable>

      {renderProgress()}

      {/* {renderDownloadErrorModal()} */}

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
            ep={ep}
            videoId={id}
            movieTitle={title}
            handleDownloadMovie={handleDownloadMovie}
            setShowDownloadFailureModal={setShowDownloadFailureModal}
            setBroken={setBroken}
          />
        )}
        confirmAction={handleRetry}
      />

      <AlertModal
        iconName="download"
        iconColor={theme.iplayya.colors.vibrantpussy}
        message={`Are you sure you want to stop downloading "${title}"?`}
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

DownloadItem.propTypes = {
  id: PropTypes.string,
  ep: PropTypes.string,
  handleSelectItem: PropTypes.func,
  title: PropTypes.string,
  year: PropTypes.string,
  time: PropTypes.string,
  rating_mpaa: PropTypes.string,
  age_rating: PropTypes.string,
  category: PropTypes.string,
  imageUrl: PropTypes.string,
  downloadProgress: PropTypes.array,
  task: PropTypes.object,
  longPressAction: PropTypes.func,
  activateCheckboxes: PropTypes.bool,
  selectedItems: PropTypes.array,
  handleStopDownload: PropTypes.func,
  handleDownloadMovie: PropTypes.func,
  donwloadStarted: PropTypes.bool,
  updateDownloadsProgressAction: PropTypes.func,
  isConnected: PropTypes.bool
};

const actions = {
  updateDownloadsProgressAction: Creators.updateDownloadsProgress
};
const mapStateToProps = createStructuredSelector({
  downloadProgress: selectDownloadsProgress,
  isConnected: selectIsConnected
});

const enhance = compose(connect(mapStateToProps, actions));

export default enhance(React.memo(DownloadItem));
