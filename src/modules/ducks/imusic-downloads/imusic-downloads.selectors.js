import { createSelector } from 'reselect';

export const ImusicDownloadsState = (state) => state.imusicDownloads;

export const selectError = createSelector([ImusicDownloadsState], ({ error }) => error);

export const selectIsFetching = createSelector(
  [ImusicDownloadsState],
  ({ isFetching }) => isFetching
);

export const selectDownloads = createSelector([ImusicDownloadsState], ({ downloads }) => {
  return downloads;
});

export const selectDownloadsProgress = createSelector(
  [ImusicDownloadsState],
  ({ downloadsProgress }) => downloadsProgress
);

export const selectDownloadStarted = createSelector(
  [ImusicDownloadsState],
  ({ downloadStarted }) => downloadStarted
);
