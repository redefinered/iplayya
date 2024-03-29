import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    downloadStart: null,
    downloadStarted: null,
    downloadStartFailure: ['error'],

    updateDownloads: ['downloadTask'],
    updateProgress: ['progress'],
    cleanUpProgress: ['trackIds'],
    resetProgress: null,

    removeDownloadsByIds: ['ids']
  },
  { prefix: '@ImusicDownloads/' }
);

export { Types, Creators };
