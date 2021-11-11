import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, StyleSheet, Modal, View } from 'react-native';
import { withTheme, Text, TouchableRipple } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import Spacer from 'components/spacer.component';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/imovie-downloads/imovie-downloads.actions';
import { selectDownloadsProgress } from 'modules/ducks/imovie-downloads/imovie-downloads.selectors';
import { getConfigForVideoDownload, downloadPath, createFontFormat } from 'utils';
import RNFetchBlob from 'rn-fetch-blob';
import RNBackgroundDownloader from 'react-native-background-downloader';
import {
  selectMovieTitle,
  selectMovie,
  selectCurrentEpisode
} from 'modules/ducks/movies/movies.selectors';
import { selectNetworkInfo } from 'modules/app';
import { checkExistingDownloads } from 'services/imovie-downloads.service';
import uuid from 'react-uuid';
import DeviceInfo from 'react-native-device-info';

const DownloadButton = ({
  videoId,
  theme,
  movie,
  movieTitle,
  currentEpisode,
  updateDownloadsProgressAction,
  updateDownloadsAction,
  downloadsProgress,
  cleanUpDownloadsProgressAction,
  downloadStartedAction,
  downloadStartFailureAction,
  networkInfo
}) => {
  const [files, setFiles] = React.useState([]);
  const [isMovieDownloaded, setIsMovieDownloaded] = React.useState(false);
  const [sources, setSources] = React.useState([]);
  const [selectedDownloadUrl, setSelectedDownloadUrl] = React.useState(null);
  const [showDownloadOptionsModal, setShowDownloadOptionsModal] = React.useState(false);
  const [startingDownload, setStartingDownload] = React.useState(false);

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
      let config = getConfigForVideoDownload(video);

      /// set starting download to true
      setStartingDownload(true);

      // eslint-disable-next-line no-unused-vars
      let task = RNBackgroundDownloader.download(config)
        .begin((expectedBytes) => {
          console.log(`Going to download ${expectedBytes} bytes!`);
          downloadStartedAction();
        })
        .progress((percent) => {
          /// set starting download to false
          setStartingDownload(false);

          updateDownloadsProgressAction({ id: downloadId, progress: percent * 100 });
        })
        .done(() => {
          console.log('Download is done!');

          updateDownloadsProgressAction({ id: downloadId, progress: 100 });

          let completedItems = downloadsProgress.filter(
            ({ received, total }) => received === total
          );
          completedItems = completedItems.map(({ id }) => id);

          cleanUpDownloadsProgressAction([video.videoId, ...completedItems]);
        })
        .error((error) => {
          console.log('Download canceled due to error: ', error);
          downloadStartFailureAction(error.message);

          // set starting download to false
          setStartingDownload(false);
        });

      updateDownloadsAction({
        id: downloadId,
        ep,
        url,
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

  React.useEffect(() => {
    if (!selectedDownloadUrl) return;

    execDownload(selectedDownloadUrl);
  }, [selectedDownloadUrl]);

  const hideDownloadOptions = () => {
    setShowDownloadOptionsModal(false);
  };

  /// return an empty div early if networkInfo is null
  if (!networkInfo) return <View />;

  // console.log('sources', sources);
  // eslint-disable-next-line no-unused-vars
  const execDownload = async (url) => {
    // hide resolution options for download
    hideDownloadOptions();

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
      url,
      is_series: movie.is_series,
      currentEpisode
    });
  };

  const handleDownloadPress = () => {
    if (isMovieDownloaded) return;
    if (startingDownload) return;

    let downloadInProgress =
      typeof downloadsProgress.find(({ id }) => id === videoId) !== 'undefined';

    if (downloadInProgress) return;

    setShowDownloadOptionsModal(true);
  };

  const getColor = () => {
    if (!networkInfo.isConnected) return 'gray';
    if (isMovieDownloaded) return theme.iplayya.colors.vibrantpussy;
    return 'white';
  };

  if (!networkInfo) return <View />;

  return (
    <React.Fragment>
      <Pressable
        disabled={!networkInfo.isConnected}
        onPress={handleDownloadPress}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? 'rgba(0,0,0,0.28)' : 'transparent',
            borderRadius: 44,
            padding: 8
            // ...styles.headerButtonContainer
          }
        ]}
      >
        <View style={styles.headerButtonContainer}>
          <Icon name="download" size={theme.iconSize(3)} color={getColor()} />
        </View>
      </Pressable>

      <Modal animationType="slide" visible={showDownloadOptionsModal} transparent>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#202530', paddingTop: 20 }}>
            {sources.map(({ id, label, link }) => (
              <TouchableRipple
                key={id}
                onPress={() => setSelectedDownloadUrl(link.split(' ')[1])}
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
            <TouchableRipple
              style={{
                alignItems: 'center',
                paddingTop: 20,
                paddingBottom: DeviceInfo.hasNotch() ? 33 : 20
              }}
              onPress={() => hideDownloadOptions()}
            >
              <Text>Cancel</Text>
            </TouchableRipple>
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
    alignItems: 'center'
  }
});

DownloadButton.propTypes = {
  theme: PropTypes.object,
  movie: PropTypes.object,
  videoId: PropTypes.string,
  movieTitle: PropTypes.string,
  updateDownloadsAction: PropTypes.func,
  updateDownloadsProgressAction: PropTypes.func,
  downloadsProgress: PropTypes.any,
  cleanUpDownloadsProgressAction: PropTypes.func,
  networkInfo: PropTypes.object,
  currentEpisode: PropTypes.object,
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
  movie: selectMovie,
  movieTitle: selectMovieTitle,
  downloadsProgress: selectDownloadsProgress,
  networkInfo: selectNetworkInfo,
  currentEpisode: selectCurrentEpisode
});

export default compose(connect(mapStateToProps, actions), withTheme)(DownloadButton);
