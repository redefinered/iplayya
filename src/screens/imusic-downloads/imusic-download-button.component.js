import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, StyleSheet, View } from 'react-native';
import { withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/imusic-downloads/imusic-downloads.actions';
import { selectDownloadsProgress } from 'modules/ducks/imusic-downloads/imusic-downloads.selectors';
import { selectNetworkInfo } from 'modules/app';
import { checkExistingDownloads, listDownloadedFiles } from 'services/imusic-downloads.service';
import { downloadPath, createFilenameForAudioTrack, checkIfTrackOrAlbumIsDownloaded } from 'utils';
import RNBackgroundDownloader from 'react-native-background-downloader';

const createDownloadConfig = ({ taskId, url, ...rest }) => {
  const filename = createFilenameForAudioTrack({ taskId, ...rest });

  /// id, url, and destination are proprties required for background downloader
  return { id: taskId, url, destination: `${downloadPath}/${filename}` };
};

const DownloadButton = ({
  theme,
  sub,
  updateProgressAction,
  updateDownloadsAction,
  downloadsProgress,
  cleanUpProgressAction,
  downloadStartedAction,
  downloadStartFailureAction,
  networkInfo
}) => {
  // console.log({ sub });
  const [isDownloaded, setIsDownloaded] = React.useState(null);
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    if (!sub) return;

    checkIfAlreadyDownloaded(sub);
  }, [sub]);

  console.log({ isDownloaded });

  React.useEffect(() => {
    if (!networkInfo) return setIsConnected(false);

    if (!networkInfo.isConnected) return setIsConnected(false);

    return setIsConnected(true);
  }, [networkInfo]);

  const checkIfAlreadyDownloaded = async (sub) => {
    const downloaded = await checkIfTrackOrAlbumIsDownloaded(sub);
    setIsDownloaded(downloaded);
  };

  const startDownload = (track) => {
    const { id, url, albumId } = track;

    const taskId = `a_${id}_${albumId}`;

    // return if there is no available source to download
    if (typeof url === 'undefined') {
      console.log('no source');
      return;
    }

    try {
      let config = createDownloadConfig({ taskId, ...track });

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
          listDownloadedFiles();

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
        track
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  /// gets file ids from filesystem and populates the files data
  // for use for checking if the file is already downloaded
  // const checkIfTrackIsDownlowded = async () => {
  //   const ls = await RNFetchBlob.fs.ls(downloadPath);
  //   const dls = ls.map((file) => {
  //     let split = file.split('_');
  //     return split[0]; // this is the ID
  //   });
  //   setFiles(dls);
  // };

  const execDownload = async (sub) => {
    /// return if already downloaded
    if (isDownloaded) return;
    console.log('x');

    let tracks;

    /// return if there is no subject yet
    if (typeof sub === 'undefined') return;

    if (typeof sub.tracks === 'undefined') {
      /// if the subject is a track
      tracks = [sub];
    } else {
      /// subject is an album
      tracks = sub.tracks;
    }

    // don't download if not connected to internet
    if (!isConnected) return;

    /// check if already downloading
    const activeDownloads = await checkExistingDownloads();

    // eslint-disable-next-line react/prop-types
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];

      // eslint-disable-next-line react/prop-types
      const downloadingItem = activeDownloads.find(({ id }) => id === track.id);

      if (typeof downloadingItem !== 'undefined') {
        /// return if already downloading
        continue;
      }

      startDownload(track);
    }
  };

  const getColor = () => {
    /// change to disabled color if not connected to internet or there is no subject
    if (!isConnected || typeof sub === 'undefined') return 'gray';

    if (isDownloaded) return theme.iplayya.colors.vibrantpussy;

    return 'white';
  };

  return (
    <Pressable
      disabled={!isConnected}
      onPress={() => execDownload(sub)}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? 'rgba(0,0,0,0.28)' : 'transparent',
          borderRadius: 44,
          padding: 8
        }
      ]}
    >
      <View style={styles.headerButtonContainer}>
        <Icon name="download" size={theme.iconSize(3)} color={getColor()} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  headerButtonContainer: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

DownloadButton.propTypes = {
  id: PropTypes.string,
  theme: PropTypes.object,
  sub: PropTypes.object,
  isMovieDownloaded: PropTypes.bool,
  updateDownloadsAction: PropTypes.func,
  updateProgressAction: PropTypes.func,
  downloadsProgress: PropTypes.any,
  cleanUpProgressAction: PropTypes.func,
  networkInfo: PropTypes.object,
  downloadStartedAction: PropTypes.func,
  downloadStartFailureAction: PropTypes.func
};

const actions = {
  updateDownloadsAction: Creators.updateDownloads,
  updateProgressAction: Creators.updateProgress,
  cleanUpProgressAction: Creators.cleanUpProgress,
  downloadStartedAction: Creators.downloadStarted,
  downloadStartFailureAction: Creators.downloadStartFailure
};

const mapStateToProps = createStructuredSelector({
  downloadsProgress: selectDownloadsProgress,
  networkInfo: selectNetworkInfo
});

export default compose(connect(mapStateToProps, actions), withTheme)(DownloadButton);
