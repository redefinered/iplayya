import React from 'react';
import PropTypes from 'prop-types';
import ActionSheet from 'components/action-sheet/action-sheet.component';
import { Creators } from 'modules/ducks/imusic-downloads/imusic-downloads.actions';
import { Creators as FavoritesCreators } from 'modules/ducks/imusic-favorites/imusic-favorites.actions';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { createDownloadConfig } from 'screens/imusic-downloads/imusic-download-button.component';
import { selectDownloadsProgress } from 'modules/ducks/imusic-downloads/imusic-downloads.selectors';
import { selectNetworkInfo } from 'modules/app';
import { checkIfTrackOrAlbumIsDownloaded } from 'utils';
import RNBackgroundDownloader from 'react-native-background-downloader';

const AlbumTrackMoreMenu = ({
  selectedTrack,
  hideActionSheet,
  showActionSheet,
  downloadsProgress,
  addTrackToFavoritesAction,
  downloadStartedAction,
  updateProgressAction,
  updateDownloadsAction,
  cleanUpProgressAction,
  downloadStartFailureAction,
  networkInfo
}) => {
  console.log({ selectedTrack });
  const handleAddToFavoritesPress = () => {
    if (!selectedTrack) return;

    addTrackToFavoritesAction({ trackId: selectedTrack.id, albumId: selectedTrack.albumId });

    hideActionSheet();
  };

  const handleDownloadPress = () => {
    // console.log('download item');
    executeDownload(selectedTrack.url);
    hideActionSheet();
  };

  const actions = [
    {
      icon: 'heart-solid',
      title: 'Add to favorites',
      onPress: handleAddToFavoritesPress
    },
    {
      icon: 'download',
      title: 'Download',
      onPress: handleDownloadPress
    }
  ];

  const startDownload = (track) => {
    const { id, url, albumId } = track;

    const taskId = `a_${id}_${albumId}`;

    // return if there is no available source to download
    if (typeof url === 'undefined') {
      console.log('no source');
      return;
    }

    try {
      let config = createDownloadConfig({ taskId, ...selectedTrack });

      let task = RNBackgroundDownloader.download(config)
        .begin((expectedBytes) => {
          console.log(`Going to download ${expectedBytes} bytes!`);
          downloadStartedAction();
        })
        .progress((percent) => {
          updateProgressAction({ id, progress: percent * 100 });
        })
        .done(() => {
          /// FOR DEVELOPMENT: list downloaded file when a download is finished
          // listDownloadedFiles();

          console.log('Download is done!');

          updateProgressAction({ id, progress: 100 });

          let completedItems = downloadsProgress.filter(({ progress }) => progress === 100);

          completedItems = completedItems.map(({ id }) => id);

          console.log({ completedItems });

          cleanUpProgressAction([track.id, ...completedItems]);
        })
        .error((error) => {
          console.log('Download canceled due to error: ', error);
          downloadStartFailureAction(error.message);
        });

      /// download item in state might need to be updated in the future to make a leaner data
      updateDownloadsAction({
        taskId,
        albumId: track.albumId,
        url,
        task,
        track: selectedTrack
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const executeDownload = async (url) => {
    if (!url) return;

    const isDownloaded = await checkIfTrackOrAlbumIsDownloaded(selectedTrack);

    /// stop if already downloaded
    if (isDownloaded) return;

    // don't download if not connected to internet
    if (!networkInfo) return;

    // don't download if not connected to internet
    if (!networkInfo.isConnected) return;

    startDownload({
      id: selectedTrack.id,
      albumId: selectedTrack.albumId,
      url
    });
  };

  return <ActionSheet visible={showActionSheet} actions={actions} hideAction={hideActionSheet} />;
};

AlbumTrackMoreMenu.propTypes = {
  selectedTrack: PropTypes.object,
  showActionSheet: PropTypes.bool,
  hideActionSheet: PropTypes.func,
  addTrackToFavoritesAction: PropTypes.func,
  downloadsProgress: PropTypes.array,
  downloadStartedAction: PropTypes.func,
  updateProgressAction: PropTypes.func,
  updateDownloadsAction: PropTypes.func,
  downloadStartFailureAction: PropTypes.func,
  cleanUpProgressAction: PropTypes.func,
  networkInfo: PropTypes.object
};

const actions = {
  addTrackToFavoritesAction: FavoritesCreators.addTrackToFavorites,
  downloadStartedAction: Creators.downloadStarted,
  updateDownloadsAction: Creators.updateDownloads,
  updateProgressAction: Creators.updateProgress,
  cleanUpProgressAction: Creators.cleanUpProgress,
  downloadStartFailureAction: Creators.downloadStartFailure
};

const mapStateToProps = createStructuredSelector({
  downloadsProgress: selectDownloadsProgress,
  networkInfo: selectNetworkInfo
});

export default connect(mapStateToProps, actions)(AlbumTrackMoreMenu);
