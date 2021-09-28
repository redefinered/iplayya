import { createSelector } from 'reselect';
import { moviesState } from 'modules/ducks/movies/movies.selectors';

export const imovieDownloadsState = (state) => state.imovieDownloads;

export const selectError = createSelector([imovieDownloadsState], ({ error }) => error);

export const selectIsFetching = createSelector(
  [imovieDownloadsState],
  ({ isFetching }) => isFetching
);

export const selectDownloads = createSelector([imovieDownloadsState], ({ downloads }) => {
  return downloads;
});

export const selectDownloadsData = createSelector(
  [imovieDownloadsState],
  ({ downloadsData }) => downloadsData
);

export const selectDownloadsProgress = createSelector(
  [imovieDownloadsState],
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
  [imovieDownloadsState],
  ({ downloadStarted }) => downloadStarted
);
