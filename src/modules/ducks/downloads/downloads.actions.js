import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    updateDownloads: ['downloadTask'],
    updateDownloadsProgress: ['data'],
    cleanUpDownloadsProgress: ['ids'],
    resetDownloadsProgress: [],

    getDownloadsStart: [],
    getDownloads: ['data'],
    getDownloadsSuccess: ['data'],
    getDownloadsFailure: ['error'],

    reset: []
  },
  { prefix: '@Downloads/' }
);

export { Types, Creators };
