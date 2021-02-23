import { createSelector } from 'reselect';

export const sportsState = (state) => state.sports;

export const selectIsFetching = createSelector([sportsState], ({ isFetching }) => isFetching);
export const selectError = createSelector([sportsState], ({ error }) => error);
export const selectPaginatorInfo = createSelector(
  [sportsState],
  ({ paginatorInfo }) => paginatorInfo
);
export const selectGenres = createSelector([sportsState], ({ genres }) => genres);
export const selectChannels = createSelector([sportsState], ({ channels }) => channels);
export const selectChannel = createSelector([sportsState], ({ channel }) => channel);
export const selectFavorites = createSelector([sportsState], ({ favorites }) => favorites);
export const selectAddedToFavorites = createSelector(
  [sportsState],
  ({ addedToFavorites }) => addedToFavorites
);
export const selectRemovedFromFavorites = createSelector(
  [sportsState],
  ({ removedFromFavorites }) => removedFromFavorites
);
