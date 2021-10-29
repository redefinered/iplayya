import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import Button from 'components/button/button.component';
import { Creators } from 'modules/ducks/imusic-downloads/imusic-downloads.actions';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectDownloadsProgress } from 'modules/ducks/imusic-downloads/imusic-downloads.selectors';
import { selectDownloads } from 'modules/ducks/imusic-downloads/imusic-downloads.selectors';
import { selectNetworkInfo } from 'modules/app';

const RetryDownloadButton = ({
  track,
  downloads,
  networkInfo,
  executeDownload,
  setShowDownloadFailureModal,
  setBroken
}) => {
  /// return null if downloads history is empty
  if (!downloads.length) return;

  const reloadDownload = async (url) => {
    if (!url) return;

    // hide download error modal
    setShowDownloadFailureModal(false);

    // don't download if not connected to internet
    if (!networkInfo) return;

    // don't download if not connected to internet
    if (!networkInfo.isConnected) return;

    setBroken(false);

    executeDownload({
      id: track.id,
      albumId: track.albumId,
      url
    });
  };

  return (
    <React.Fragment>
      <Button
        style={{ width: '100%', textAlign: 'center' }}
        labelStyle={styles.button}
        onPress={() => reloadDownload(track.url)}
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
  track: PropTypes.object,
  downloads: PropTypes.array,
  networkInfo: PropTypes.object,
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
