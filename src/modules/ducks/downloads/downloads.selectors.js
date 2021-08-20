import { createSelector } from 'reselect';
import { moviesState } from 'modules/ducks/movies/movies.selectors';

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

export const selectMovies = createSelector([moviesState], ({ movies }) => {
  let collection = [];
  for (let i = 0; i < movies.length; i++) {
    const categoriesWithMovies = movies[i];
    collection = [...collection, ...categoriesWithMovies.videos];
  }
  return collection;
});

export const selectDownloadStarted = createSelector(
  [downloadsState],
  ({ downloadStarted }) => downloadStarted
);
