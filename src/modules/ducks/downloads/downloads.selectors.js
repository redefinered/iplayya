import { createSelector } from 'reselect';

export const downloadsState = (state) => state.downloads;

export const selectError = createSelector([downloadsState], ({ error }) => error);

export const selectIsFetching = createSelector([downloadsState], ({ isFetching }) => isFetching);

export const selectDownloads = createSelector([downloadsState], ({ downloads }) => {
  return downloads;
});

export const selectDownloadsData = createSelector(
  [downloadsState],
  ({ downloadsData }) => downloadsData
);

export const selectDownloadsProgress = createSelector(
  [downloadsState],
  ({ downloadsProgress }) => downloadsProgress
);

const selectTaskById = ({ downloads: { downloads } }, props) => {
  const task = downloads.find(({ id }) => id === props.id);
  if (typeof task === 'undefined') return;

  return task;
};

export const selectTask = createSelector([selectTaskById], (task) => task);

const selectDownloadData = ({ downloads: { downloadsData } }, props) => {
  return downloadsData.find(({ id }) => id === props.id);
};

export const selectVideoForDownloadInfo = createSelector([selectDownloadData], (video) => video);

export const selectDownloadStarted = createSelector(
  [downloadsState],
  ({ downloadStarted }) => downloadStarted
);
