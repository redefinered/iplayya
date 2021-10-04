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
import { checkExistingDownloads } from 'services/imusic-downloads.service';
import { downloadPath, createFilenameForAudioTrack, checkIfTrackOrAlbumIsDownloaded } from 'utils';
import RNBackgroundDownloader from 'react-native-background-downloader';

const createDownloadConfig = ({ taskId, title, url }) => {
  const filename = createFilenameForAudioTrack({ taskId, title });

  /// id, url, and destination are proprties required for background downloader
  return { id: taskId, url, destination: `${downloadPath}/${filename}` };
};

const DownloadButton = ({
  theme,
  sub,
  updateDownloadsProgressAction,
  updateDownloadsAction,
  downloadsProgress,
  cleanUpDownloadsProgressAction,
  downloadStartedAction,
  downloadStartFailureAction,
  networkInfo
}) => {
  console.log({ sub });
  const [isDownloaded, setIsDownloaded] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    if (!networkInfo) return setIsConnected(false);

    if (!networkInfo.isConnected) return setIsConnected(false);

    return setIsConnected(true);
  }, [networkInfo]);

  const startDownload = React.useCallback((track) => {
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
          updateDownloadsProgressAction({ id, progress: percent * 100 });
        })
        .done(() => {
          console.log('Download is done!');

          updateDownloadsProgressAction({ id, progress: 100 });

          let completedItems = downloadsProgress.filter(
            ({ received, total }) => received === total
          );
          completedItems = completedItems.map(({ id }) => id);

          cleanUpDownloadsProgressAction([track.id, ...completedItems]);
        })
        .error((error) => {
          console.log('Download canceled due to error: ', error);
          downloadStartFailureAction(error.message);
        });

      updateDownloadsAction({
        taskId,
        url,
        task,
        track
      });
    } catch (error) {
      console.log(error.message);
    }
  }, []);

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

  const execDownload = async (tracks) => {
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
    if (!isConnected) return 'gray';

    if (isDownloaded) return theme.iplayya.colors.vibrantpussy;

    return 'white';
  };

  return (
    <Pressable
      disabled={!isConnected}
      onPress={() => execDownload(tracks)}
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
  sub: PropTypes.string,
  isMovieDownloaded: PropTypes.bool,
  updateDownloadsAction: PropTypes.func,
  updateDownloadsProgressAction: PropTypes.func,
  downloadsProgress: PropTypes.any,
  cleanUpDownloadsProgressAction: PropTypes.func,
  networkInfo: PropTypes.object,
  downloadStartedAction: PropTypes.func,
  downloadStartFailureAction: PropTypes.func
};

const actions = {
  updateDownloadsAction: Creators.updateDownloads,
  updateDownloadsProgressAction: Creators.updateDownloadsProgress,
  cleanUpDownloadsProgressAction: Creators.cleanUpDownloadsProgress,
  downloadStartedAction: Creators.downloadStarted,
  downloadStartFailureAction: Creators.downloadStartFailure
};

const mapStateToProps = createStructuredSelector({
  downloadsProgress: selectDownloadsProgress,
  networkInfo: selectNetworkInfo
});

export default compose(connect(mapStateToProps, actions), withTheme)(DownloadButton);
