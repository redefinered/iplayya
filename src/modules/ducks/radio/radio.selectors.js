import { createSelector } from 'reselect';

export const radioState = (state) => state.radio;

export const selectError = createSelector([radioState], ({ error }) => error);

export const selectIsFetching = createSelector([radioState], ({ isFetching }) => isFetching);

export const selectRadioStations = createSelector(
  [radioState],
  ({ radioStations }) => radioStations
);

export const selectFeatured = createSelector([radioState], ({ radioStations }) => {
  if (!radioStations.length) return;
  return radioStations[0]; // while waiting for API, select first item for now
});

export const selectPaginatorInfo = createSelector(
  [radioState],
  ({ paginatorInfo }) => paginatorInfo
);

export const selectPlaybackInfo = createSelector([radioState], ({ playbackInfo }) => playbackInfo);

export const selectSeekableDuration = createSelector([radioState], ({ playbackInfo }) => {
  if (!playbackInfo) return;
  return Math.floor(playbackInfo.seekableDuration);
});

export const selectCurrentTime = createSelector([radioState], ({ playbackInfo }) => {
  if (!playbackInfo) return;
  return Math.floor(playbackInfo.currentTime);
});
