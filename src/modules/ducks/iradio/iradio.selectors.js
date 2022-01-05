import { createSelector } from 'reselect';

export const radioState = (state) => state.radios;

export const selectError = createSelector([radioState], ({ error }) => error);

export const selectIsFetching = createSelector([radioState], ({ isFetching }) => isFetching);

export const selectRadioStations = createSelector(
  [radioState],
  ({ radioStations }) => radioStations
);

export const selectPaginator = createSelector([radioState], ({ paginator }) => paginator);

export const selectPlaybackInfo = createSelector([radioState], ({ playbackInfo }) => playbackInfo);

export const selectSeekableDuration = createSelector([radioState], ({ playbackInfo }) => {
  if (!playbackInfo) return;
  return Math.floor(playbackInfo.seekableDuration);
});

export const selectCurrentTime = createSelector([radioState], ({ playbackInfo }) => {
  if (!playbackInfo) return;
  return Math.floor(playbackInfo.currentTime);
});

export const selectPlaybackProgress = createSelector(
  [radioState],
  ({ playbackProgress }) => playbackProgress
);

export const selectNowPlaying = createSelector([radioState], ({ nowPlaying }) => nowPlaying);

export const selectNowPlayingLayoutInfo = createSelector(
  [radioState],
  ({ nowPlayingLayoutInfo }) => nowPlayingLayoutInfo
);

export const selectIsRadioBackgroundMode = createSelector(
  [radioState],
  ({ isRadioBackgroundMode }) => isRadioBackgroundMode
);

export const selectIsInIradioScreen = createSelector(
  [radioState],
  ({ isInIradioScreen }) => isInIradioScreen
);

export const selectPaused = createSelector([radioState], ({ paused }) => paused);

export const selectSearchResults = createSelector(
  [radioState],
  ({ searchResults }) => searchResults
);

export const selectSearchResultsPaginator = createSelector(
  [radioState],
  ({ searchResultsPaginator }) => searchResultsPaginator
);

export const selectRecentSearch = createSelector([radioState], ({ recentSearch }) => recentSearch);

export const selectIradioBottomNavLayout = createSelector(
  [radioState],
  ({ iradioBottomNavLayout }) => iradioBottomNavLayout
);
