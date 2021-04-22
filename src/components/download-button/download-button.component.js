import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import { withTheme, ActivityIndicator } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/movies/movies.actions';
import { Creators as DownloadsCreators } from 'modules/ducks/downloads/downloads.actions';
import { selectMovieUrl, selectMovieTitle } from 'modules/ducks/movies/movies.selectors';
import { selectDownloadsProgress } from 'modules/ducks/downloads/downloads.selectors';
import getConfig, { downloadPath } from './download-utils';
import RNFetchBlob from 'rn-fetch-blob';
import RNBackgroundDownloader from 'react-native-background-downloader';

const DownloadButton = ({
  theme,
  videoId,
  movieTitle,
  movieUrl,

  // downloads,
  // eslint-disable-next-line no-unused-vars
  updateDownloadsProgressAction,
  updateDownloadsAction,
  // updateDownloadIdsAction,

  downloadsProgress,
  cleanUpDownloadsProgressAction,
  setPermissionErrorAction
}) => {
  const [files, setFiles] = React.useState([]);
  const [downloading, setDownloading] = React.useState(false);
  const [isMovieDownloaded, setIsMovieDownloaded] = React.useState(false);

  React.useEffect(() => {
    checkIfMovieIsDownlowded();
  }, []);

  // React.useEffect(() => {
  //   console.log({ downloadsProgress });
  // }, [downloadsProgress]);

  const requestWritePermissionAndroid = async () => {
    if (Platform.OS === 'ios') return;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Permission to write into file storage',
          message: 'The app needs access to your file storage so you can download the file',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      );

      const readgrant = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        throw new Error('No write access');
      }

      if (readgrant !== PermissionsAndroid.RESULTS.GRANTED) {
        throw new Error('No read access');
      }

      return PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      setPermissionErrorAction(error.message);
    }
  };

  const handleDownloadMovie = async (video) => {
    if (downloading) return;

    // return if movie is already downloaded
    if (isMovieDownloaded) {
      console.log('already downloaded');
      return;
    }

    // return if there is no available source to download
    if (typeof video.url === 'undefined') {
      console.log('no source');
      return;
    }

    // set downloading state to true
    setDownloading(true);

    let androidPermission = Platform.OS === 'ios' ? true : await requestWritePermissionAndroid();

    if (!androidPermission) {
      console.log('permission denied');
      return setDownloading(false);
    }
    // console.log({ folder });
    try {
      const config = getConfig(video);

      let task = RNBackgroundDownloader.download(config)
        .begin((expectedBytes) => {
          console.log(`Going to download ${expectedBytes} bytes!`);
        })
        .progress((percent) => {
          updateDownloadsProgressAction({ id: video.videoId, progress: percent * 100 });
          // console.log(`Downloaded: ${percent * 100}%`);
        })
        .done(() => {
          console.log('Download is done!');

          let completedItems = downloadsProgress.filter(
            ({ received, total }) => received === total
          );
          completedItems = completedItems.map(({ id }) => id);

          cleanUpDownloadsProgressAction([video.videoId, ...completedItems]);

          // set downloading state to false
          setDownloading(false);
        })
        .error((error) => {
          console.log('Download canceled due to error: ', error);
        });

      updateDownloadsAction(task);
    } catch (error) {
      console.log(error.message);
    }
  };

  const checkIfMovieIsDownlowded = async () => {
    const ls = await RNFetchBlob.fs.ls(downloadPath);
    const dls = ls.map((file) => {
      let split = file.split('_');
      return split[0]; // this is the ID
    });
    setFiles(dls);
  };

  React.useEffect(() => {
    // console.log({ files });
    if (files.length) {
      const check = files.find((f) => f === videoId);
      if (typeof check !== 'undefined') {
        setIsMovieDownloaded(true);
      } else {
        setIsMovieDownloaded(false);
      }
    }
  }, [files]);

  // console.log({ downloading });

  return (
    <Pressable
      onPress={() => handleDownloadMovie({ videoId, title: movieTitle, url: movieUrl })}
      style={styles.headerButtonContainer}
    >
      {downloading ? (
        <ActivityIndicator />
      ) : (
        <Icon
          name="download"
          size={24}
          color={isMovieDownloaded ? theme.iplayya.colors.vibrantpussy : 'white'}
        />
      )}
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
    alignItems: 'center',
    marginLeft: 15
  }
});

DownloadButton.propTypes = {
  theme: PropTypes.object,
  isMovieDownloaded: PropTypes.bool,
  setIsMovieDownloaded: PropTypes.func,
  handleDownloadMovie: PropTypes.func,
  videoId: PropTypes.string,
  movieUrl: PropTypes.string,
  movieTitle: PropTypes.string,
  updateDownloadsAction: PropTypes.func,
  updateDownloadsProgressAction: PropTypes.func,
  downloadsProgress: PropTypes.any,
  cleanUpDownloadsProgressAction: PropTypes.func,
  setPermissionErrorAction: PropTypes.func
};

const actions = {
  updateDownloadsAction: DownloadsCreators.updateDownloads,
  updateDownloadsProgressAction: DownloadsCreators.updateDownloadsProgress,
  cleanUpDownloadsProgressAction: DownloadsCreators.cleanUpDownloadsProgress,
  setPermissionErrorAction: Creators.setPermissionError
};

const mapStateToProps = createStructuredSelector({
  movieUrl: selectMovieUrl,
  movieTitle: selectMovieTitle,
  downloadsProgress: selectDownloadsProgress
});

export default compose(connect(mapStateToProps, actions), withTheme)(DownloadButton);
