import { createSelector } from 'reselect';

export const sportState = (state) => state.sport;

export const selectError = createSelector([sportState], ({ error }) => error);

export const selectIsFetching = createSelector([sportState], ({ isFetching }) => isFetching);

export const selectMovies = createSelector([sportState], ({ movies }) => movies);

export const selectFeatured = createSelector([sportState], ({ movies }) => {
  if (!movies.length) return;
  return movies[0]; // while waiting for API, select first item for now
});

export const selectPaginatorInfo = createSelector(
  [sportState],
  ({ paginatorInfo }) => paginatorInfo
);

export const selectPlaybackInfo = createSelector([sportState], ({ playbackInfo }) => playbackInfo);

export const selectSeekableDuration = createSelector([sportState], ({ playbackInfo }) => {
  if (!playbackInfo) return 98 * 60;
  return Math.floor(playbackInfo.seekableDuration);
});

export const selectCurrentTime = createSelector([sportState], ({ playbackInfo }) => {
  if (!playbackInfo) return 0;
  return Math.floor(playbackInfo.currentTime);
});
