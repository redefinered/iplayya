import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import { Pressable, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import { withTheme, ActivityIndicator } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import RNFetchBlob from 'rn-fetch-blob';
import {
  selectDownloads,
  selectMovieUrl,
  selectMovieTitle,
  selectDownloadsProgress
} from 'modules/ducks/movies/movies.selectors';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/movies/movies.actions';
import getConfig from './get-config';

let dirs = RNFetchBlob.fs.dirs;

const DownloadButton = ({
  theme,
  videoId,
  movieTitle,
  movieUrl,

  downloads,
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

    // let source = convertHttpToHttps(video.url);
    // let source =
    //   'https://firebasestorage.googleapis.com/v0/b/iplayya.appspot.com/o/12AngryMen.mp4?alt=media&token=e5fbea09-e383-4fbb-85bd-206bceb4ef4d';
    let source = video.url;

    // set downloading state to true
    setDownloading(true);

    const permission = await requestWritePermissionAndroid();

    if (!permission) {
      return setDownloading(false);
    }

    try {
      const config = getConfig(video);

      const currentDownloads = downloads;
      currentDownloads[`task_${video.videoId}`] = {
        id: video.videoId,
        task: RNFetchBlob.config(config)
          .fetch('GET', source, {
            //some headers ..
          })

          /**
           * FOR DEVELOPMENT
           * testing a sample network video for downloads progress UI development
           */
          // .fetch('GET', samplenetworkvideo, {})

          .progress({ count: 100 }, (received, total) => {
            console.log({ received, total });
            // const progress = received / total;
            updateDownloadsProgressAction({ id: video.videoId, received, total });
            // console.log('progress', progress);
          })
          .then((res) => {
            // the temp file path
            console.log('The file saved to ', res.path());

            let completedItems = downloadsProgress.filter(
              ({ received, total }) => received === total
            );
            completedItems = completedItems.map(({ id }) => id);

            cleanUpDownloadsProgressAction([video.videoId, ...completedItems]);

            // set downloading state to false
            setDownloading(false);
          })
          .catch((error) => {
            // throw new Error(error.message);
            console.log({ error });
          }),
        status: 'in-prgress'
      };

      // setDownloads(Object.assign(downloads, currentDownloads));
      updateDownloadsAction(Object.assign(downloads, currentDownloads));
      // updateDownloadIdsAction(video.videoId);
    } catch (error) {
      console.log(error.message);
    }
  };

  const checkIfMovieIsDownlowded = async () => {
    // const dir = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.MovieDir;
    const dir = dirs.DocumentDir;
    const ls = await RNFetchBlob.fs.ls(dir);
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
  downloads: PropTypes.object,
  updateDownloadsAction: PropTypes.func,
  updateDownloadsProgressAction: PropTypes.func,
  downloadsProgress: PropTypes.any,
  cleanUpDownloadsProgressAction: PropTypes.func,
  setPermissionErrorAction: PropTypes.func
};

const actions = {
  updateDownloadsAction: Creators.updateDownloads,
  updateDownloadsProgressAction: Creators.updateDownloadsProgress,
  cleanUpDownloadsProgressAction: Creators.cleanUpDownloadsProgress,
  setPermissionErrorAction: Creators.setPermissionError
};

const mapStateToProps = createStructuredSelector({
  downloads: selectDownloads,
  movieUrl: selectMovieUrl,
  movieTitle: selectMovieTitle,
  downloadsProgress: selectDownloadsProgress
});

export default compose(connect(mapStateToProps, actions), withTheme)(DownloadButton);
