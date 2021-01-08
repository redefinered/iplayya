import { createSelector } from 'reselect';

export const movieState = (state) => state.movie;

export const selectError = createSelector([movieState], ({ error }) => error);

export const selectIsFetching = createSelector([movieState], ({ isFetching }) => isFetching);

export const selectMovies = createSelector([movieState], ({ movies }) => movies);

export const selectFeatured = createSelector([movieState], ({ movies }) => {
  if (!movies.length) return;
  return movies[0]; // while waiting for API, select first item for now
});

export const selectPaginatorInfo = createSelector(
  [movieState],
  ({ paginatorInfo }) => paginatorInfo
);

export const selectPlaybackInfo = createSelector([movieState], ({ playbackInfo }) => playbackInfo);

export const selectSeekableDuration = createSelector([movieState], ({ playbackInfo }) => {
  if (!playbackInfo) return 0;
  if (typeof playbackInfo.seekableDuration === 'undefined') return 0;
  return Math.floor(playbackInfo.seekableDuration);
});

export const selectCurrentTime = createSelector([movieState], ({ playbackInfo }) => {
  if (!playbackInfo) return 0;
  if (typeof playbackInfo.currentTime === 'undefined') return 0;
  return Math.floor(playbackInfo.currentTime);
});
