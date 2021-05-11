import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import { Pressable, StyleSheet } from 'react-native';
import { withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/movies/movies.actions';
import { Creators as DownloadsCreators } from 'modules/ducks/downloads/downloads.actions';
import { selectDownloadsProgress } from 'modules/ducks/downloads/downloads.selectors';
import { getConfig, downloadPath } from 'utils';
import RNFetchBlob from 'rn-fetch-blob';
import RNBackgroundDownloader from 'react-native-background-downloader';
import {
  selectMovieTitle,
  selectDownloadUrl,
  selectMovie,
  selectCurrentEpisode
} from 'modules/ducks/movies/movies.selectors';
import { selectNetworkInfo } from 'modules/ducks/auth/auth.selectors';

const DownloadButton = ({
  theme,
  movie,
  videoId,
  movieTitle,
  donwloadUrl,

  currentEpisode,

  // downloads,
  // eslint-disable-next-line no-unused-vars
  updateDownloadsProgressAction,
  updateDownloadsAction,
  // updateDownloadIdsAction,

  downloadsProgress,
  cleanUpDownloadsProgressAction,
  // setPermissionErrorAction,

  // eslint-disable-next-line react/prop-types
  downloadStartedAction,
  // eslint-disable-next-line react/prop-types
  downloadStartFailureAction,

  networkInfo
}) => {
  const [files, setFiles] = React.useState([]);
  // const [downloading, setDownloading] = React.useState(false);
  const [isMovieDownloaded, setIsMovieDownloaded] = React.useState(false);

  React.useEffect(() => {
    checkIfMovieIsDownlowded();
  }, []);

  const handleDownloadMovie = async (video) => {
    const { videoId, url, is_series, currentEpisode } = video;

    let ep = '';

    if (is_series) {
      ep = `SO${currentEpisode.season}E${currentEpisode.episode}`;
    }

    const downloadId = `${videoId}${ep}`;

    // return if movie is already downloaded
    if (isMovieDownloaded) {
      console.log('already downloaded');
      return;
    }

    // return if there is no available source to download
    if (typeof url === 'undefined') {
      console.log('no source');
      return;
    }

    try {
      let config = getConfig(video);

      let task = RNBackgroundDownloader.download(config)
        .begin((expectedBytes) => {
          console.log(`Going to download ${expectedBytes} bytes!`);
          downloadStartedAction();
        })
        .progress((percent) => {
          updateDownloadsProgressAction({ id: downloadId, progress: percent * 100 });
        })
        .done(() => {
          console.log('Download is done!');

          let completedItems = downloadsProgress.filter(
            ({ received, total }) => received === total
          );
          completedItems = completedItems.map(({ id }) => id);

          cleanUpDownloadsProgressAction([video.videoId, ...completedItems]);
        })
        .error((error) => {
          console.log('Download canceled due to error: ', error);
          downloadStartFailureAction(error.message);
        });

      updateDownloadsAction({
        id: downloadId,
        ep,
        task,
        movie
      });
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

  const getColor = () => {
    if (!networkInfo.isConnected) return 'gray';
    if (isMovieDownloaded) return theme.iplayya.colors.vibrantpussy;
    return 'white';
  };

  return (
    <Pressable
      disabled={!networkInfo.isConnected}
      onPress={() =>
        handleDownloadMovie({
          videoId,
          title: movieTitle,
          url: donwloadUrl,
          is_series: movie.is_series,
          currentEpisode
        })
      }
      style={styles.headerButtonContainer}
    >
      <Icon name="download" size={24} color={getColor()} />
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
  movie: PropTypes.object,
  isMovieDownloaded: PropTypes.bool,
  setIsMovieDownloaded: PropTypes.func,
  handleDownloadMovie: PropTypes.func,
  videoId: PropTypes.string,
  donwloadUrl: PropTypes.string,
  movieTitle: PropTypes.string,
  updateDownloadsAction: PropTypes.func,
  updateDownloadsProgressAction: PropTypes.func,
  downloadsProgress: PropTypes.any,
  cleanUpDownloadsProgressAction: PropTypes.func,
  setPermissionErrorAction: PropTypes.func,
  networkInfo: PropTypes.object,
  currentEpisode: PropTypes.object
};

const actions = {
  updateDownloadsAction: DownloadsCreators.updateDownloads,
  updateDownloadsProgressAction: DownloadsCreators.updateDownloadsProgress,
  cleanUpDownloadsProgressAction: DownloadsCreators.cleanUpDownloadsProgress,
  setPermissionErrorAction: Creators.setPermissionError,
  downloadStartedAction: DownloadsCreators.downloadStarted,
  downloadStartFailureAction: DownloadsCreators.downloadStartFailure
};

const mapStateToProps = createStructuredSelector({
  // get movie from state to add to downloads data for offline use
  movie: selectMovie,
  // movieUrl: selectMovieUrl,
  donwloadUrl: selectDownloadUrl,
  movieTitle: selectMovieTitle,
  downloadsProgress: selectDownloadsProgress,
  networkInfo: selectNetworkInfo,
  currentEpisode: selectCurrentEpisode
});

export default compose(connect(mapStateToProps, actions), withTheme)(DownloadButton);
