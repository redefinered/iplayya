import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import Button from 'components/button/button.component';
import { Creators } from 'modules/ducks/imovie-downloads/imovie-downloads.actions';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectDownloadsProgress } from 'modules/ducks/imovie-downloads/imovie-downloads.selectors';
import { selectDownloads } from 'modules/ducks/imovie-downloads/imovie-downloads.selectors';
import { selectNetworkInfo } from 'modules/app';

const RetryDownloadButton = ({
  ep,
  videoId,
  movieTitle,
  downloads,
  networkInfo,
  executeDownload,
  setShowDownloadFailureModal,
  setBroken
}) => {
  const [currentEpisode, setCurrentEpisode] = React.useState(null);

  /// return null if downloads history is empty
  if (!downloads.length) return;

  /// checks if video is a series
  const seriesId = videoId.search('SO');

  /// get video depending on if it's a series or not
  const { movie, url: downloadUrl } =
    seriesId >= 0
      ? downloads.find(({ id }) => id === videoId)
      : downloads.find(({ movie }) => movie.id === videoId);

  React.useEffect(() => {
    if (!movie) return;
    if (!movie.is_series) return;

    const [seasonString, episode] = ep.split('E');
    // eslint-disable-next-line no-unused-vars
    const [useLessLetterS, season] = seasonString.split('O');

    setCurrentEpisode({ season, episode });
  }, []);

  const reloadDownload = async (url) => {
    if (!url) return;

    // hide download error modal
    setShowDownloadFailureModal(false);

    // don't download if not connected to internet
    if (!networkInfo.isConnected) return;

    setBroken(false);

    executeDownload({
      ep,
      videoId,
      movie,
      title: movieTitle,
      url,
      is_series: movie.is_series,
      currentEpisode
    });
  };

  return (
    <React.Fragment>
      <Button
        style={{ width: '100%', textAlign: 'center' }}
        labelStyle={styles.button}
        onPress={() => reloadDownload(downloadUrl)}
      >
        Reload
      </Button>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  button: { fontSize: 17, fontWeight: '700' }
});

RetryDownloadButton.propTypes = {
  ep: PropTypes.string,
  videoId: PropTypes.string,
  movieTitle: PropTypes.string,
  downloads: PropTypes.array,
  networkInfo: PropTypes.object,
  isMovieDownloaded: PropTypes.bool,
  downloadStartedAction: PropTypes.func,
  updateDownloadsProgressAction: PropTypes.func,
  downloadsProgress: PropTypes.array,
  cleanUpDownloadsProgressAction: PropTypes.func,
  downloadStartFailureAction: PropTypes.func,
  executeDownload: PropTypes.func,
  setBroken: PropTypes.func,
  setShowDownloadFailureModal: PropTypes.func
};

const actions = {
  downloadStartedAction: Creators.downloadStarted
};

const mapStateToProps = createStructuredSelector({
  downloads: selectDownloads,
  downloadsProgress: selectDownloadsProgress,
  networkInfo: selectNetworkInfo
});

const enhance = compose(connect(mapStateToProps, actions));

export default enhance(React.memo(RetryDownloadButton));
