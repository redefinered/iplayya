import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, StyleSheet, Platform } from 'react-native';
import { withTheme, ActivityIndicator } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import RNFetchBlob from 'rn-fetch-blob';
import {
  selectDownloads,
  selectMovieUrl,
  selectMovieTitle
} from 'modules/ducks/movies/movies.selectors';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/movies/movies.actions';

let dirs = RNFetchBlob.fs.dirs;

const DownloadButton = ({
  theme,
  // isMovieDownloaded,
  // setIsMovieDownloaded,
  // handleDownloadMovie,
  videoId,
  movieTitle,
  movieUrl,

  downloads,
  updateDownloadsProgressAction,
  updateDownloadsAction
}) => {
  const [files, setFiles] = React.useState([]);
  const [downloading, setDownloading] = React.useState(false);
  const [isMovieDownloaded, setIsMovieDownloaded] = React.useState(false);

  React.useEffect(() => {
    checkIfMovieIsDownlowded();
  }, []);

  const handleDownloadMovie = (video) => {
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

    try {
      const titlesplit = video.title.split(' ');
      const title = titlesplit.join('_');
      console.log(title);

      const currentDownloads = downloads;
      currentDownloads[`task_${video.videoId}`] = {
        id: video.videoId,
        task: RNFetchBlob.config({
          // add this option that makes response data to be stored as a file,
          // this is much more performant.
          fileCache: true,
          path: `${dirs.DocumentDir}/${video.videoId}_${title}.mp4`
        })
          .fetch('GET', video.url, {
            //some headers ..
          })
          .progress({ count: 100 }, (received, total) => {
            const progress = received / total;
            updateDownloadsProgressAction({ id: video.videoId, received, total });
            console.log('progress', progress);
          })
          .then((res) => {
            // the temp file path
            console.log('The file saved to ', res.path());

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
    } catch (error) {
      console.log(error.message);
    }
  };

  const checkIfMovieIsDownlowded = async () => {
    const dir = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
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
  updateDownloadsProgressAction: PropTypes.func
};

const actions = {
  updateDownloadsAction: Creators.updateDownloads,
  updateDownloadsProgressAction: Creators.updateDownloadsProgress
};

const mapStateToProps = createStructuredSelector({
  downloads: selectDownloads,
  movieUrl: selectMovieUrl,
  movieTitle: selectMovieTitle
});

export default compose(connect(mapStateToProps, actions), withTheme)(DownloadButton);
