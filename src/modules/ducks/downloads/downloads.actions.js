import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    downloadStart: [],
    downloadStarted: [],
    downloadStartFailure: ['error'],

    updateDownloads: ['downloadTask'],
    updateDownloadsProgress: ['data'],
    cleanUpDownloadsProgress: ['ids'],
    resetDownloadsProgress: [],

    // getDownloadsStart: [],
    // getDownloads: ['data'],
    // getDownloadsSuccess: ['data'],
    // getDownloadsFailure: ['error'],

    removeDownloadsByIds: ['ids'],

    reset: []
  },
  { prefix: '@Downloads/' }
);

export { Types, Creators };
