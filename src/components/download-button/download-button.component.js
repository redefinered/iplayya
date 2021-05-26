import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import { Pressable, StyleSheet, Modal, View, TouchableOpacity } from 'react-native';
import { withTheme, Text, TouchableRipple } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import Spacer from 'components/spacer.component';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/movies/movies.actions';
import { Creators as DownloadsCreators } from 'modules/ducks/downloads/downloads.actions';
import { selectDownloadsProgress } from 'modules/ducks/downloads/downloads.selectors';
import { getConfig, downloadPath } from 'utils';
import RNFetchBlob from 'rn-fetch-blob';
import RNBackgroundDownloader from 'react-native-background-downloader';
import { createFontFormat } from 'utils';
import {
  selectMovieTitle,
  selectDownloadUrl,
  selectMovie,
  selectCurrentEpisode
} from 'modules/ducks/movies/movies.selectors';
import { selectNetworkInfo } from 'modules/ducks/auth/auth.selectors';
import { checkExistingDownloads } from 'services/download.service';
import uuid from 'react-uuid';

const DownloadButton = ({
  videoId, // from navigation parameters

  theme,
  movie,
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
  const [sources, setSources] = React.useState([]);
  const [showDownloadOptionsModal, setShowDownloadOptionsModal] = React.useState(false);

  React.useEffect(() => {
    checkIfMovieIsDownlowded();
  }, []);

  React.useEffect(() => {
    if (movie) {
      const { is_series } = movie;

      if (is_series) {
        if (!currentEpisode) return;

        const { season, episode } = currentEpisode;
        const { series } = movie;
        const { episodes } = series.find(({ season: s }) => parseInt(s) === season);

        let downloadSources = episodes.find(({ episode: e }) => parseInt(e) === episode).video_urls;

        downloadSources = downloadSources.map(({ quality, link }) => ({
          id: uuid(),
          label: quality,
          link
        }));

        downloadSources = downloadSources.filter(({ link }) => !link.includes('/video.m3u8'));

        // console.log('xxxx', downloadSources);

        return setSources(downloadSources);
      } else {
        let downloadSources = movie.video_urls;
        downloadSources = downloadSources.map(({ quality, link }) => ({
          id: uuid(),
          label: quality,
          link
        }));

        downloadSources = downloadSources.filter(({ link }) => !link.includes('/video.m3u8'));

        return setSources(downloadSources);
      }
    }

    // if (currentEpisode && movie) {
    //   // is_series should be true at this point

    // }

    // if (movie) {

    // }
  }, [movie, currentEpisode]);

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

  const hideDownloadOptions = () => {
    setShowDownloadOptionsModal(false);
  };

  // console.log('sources', sources);
  // eslint-disable-next-line no-unused-vars
  const confirmDownload = async () => {
    // hide resolution options for download
    hideDownloadOptions(false);

    // don't download if not connected to internet
    console.log('videoId', videoId);
    if (!networkInfo.isConnected) return;

    /// check if already downloading
    const activeDownloads = await checkExistingDownloads();
    const downloadingItem = activeDownloads.find(({ id }) => id === videoId);

    if (typeof downloadingItem !== 'undefined') {
      console.log('already downloading');
      return;
    }

    handleDownloadMovie({
      videoId,
      title: movieTitle,
      url: donwloadUrl,
      is_series: movie.is_series,
      currentEpisode
    });
  };

  const getColor = () => {
    if (!networkInfo.isConnected) return 'gray';
    if (isMovieDownloaded) return theme.iplayya.colors.vibrantpussy;
    return 'white';
  };

  return (
    <React.Fragment>
      <Pressable
        disabled={!networkInfo.isConnected}
        onPress={() => setShowDownloadOptionsModal(true)}
        style={styles.headerButtonContainer}
      >
        <Icon name="download" size={24} color={getColor()} />
      </Pressable>

      <Modal animationType="slide" visible={showDownloadOptionsModal} transparent>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#202530', paddingTop: 20 }}>
            {sources.map(({ id, label }) => (
              <TouchableRipple
                key={id}
                onPress={confirmDownload}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 50,
                  // backgroundColor: theme.iplayya.colors.white10,
                  paddingHorizontal: 15
                }}
              >
                <View style={{ flex: 10.5 }}>
                  <Text style={{ ...createFontFormat(16, 22) }}>{label}</Text>
                </View>
              </TouchableRipple>
            ))}
            <Spacer size={20} />
            <View
              style={{ width: '100%', height: 1, backgroundColor: theme.iplayya.colors.white10 }}
            />
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <TouchableOpacity onPress={() => hideDownloadOptions()}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </React.Fragment>
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
