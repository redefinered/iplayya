import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    downloadStart: null,
    downloadStarted: null,
    downloadStartFailure: ['error'],

    updateDownloads: ['downloadTask'],
    updateDownloadsProgress: ['data'],
    cleanUpDownloadsProgress: ['ids'],
    resetDownloadsProgress: [],

    removeDownloadsByIds: ['ids'],

    reset: null
  },
  { prefix: '@Downloads/' }
);

export { Types, Creators };
