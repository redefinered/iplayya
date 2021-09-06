import { createSelector } from 'reselect';

export const iSportsState = (state) => state.sports;

export const selectIsFetching = createSelector([iSportsState], ({ isFetching }) => isFetching);
export const selectError = createSelector([iSportsState], ({ error }) => error);
export const selectPaginator = createSelector([iSportsState], ({ paginator }) => paginator);
export const selectPaginatorInfo = createSelector(
  [iSportsState],
  ({ paginatorInfo }) => paginatorInfo
);
export const selectGenres = createSelector([iSportsState], ({ genres }) => genres);
export const selectChannels = createSelector([iSportsState], ({ channels }) => channels);
export const selectChannel = createSelector([iSportsState], ({ channel }) => channel);
export const selectFavorites = createSelector([iSportsState], ({ favorites }) => favorites);
// added getProgram delete if conflict
export const selectPrograms = createSelector([iSportsState], ({ programs }) => programs);
export const selectAddedToFavorites = createSelector(
  [iSportsState],
  ({ addedToFavorites }) => addedToFavorites
);
export const selectRemovedFromFavorites = createSelector(
  [iSportsState],
  ({ removedFromFavorites }) => removedFromFavorites
);
// added getProgram delete if conflict
export const selectCurrentProgram = createSelector([iSportsState], ({ programs }) => {
  if (!programs.length) return;

  return programs[0];
});

export const selectSearchResults = createSelector(
  [iSportsState],
  ({ searchResults }) => searchResults
);

export const selectRecentSearch = createSelector(
  [iSportsState],
  ({ recentSearch }) => recentSearch
);

export const selectSimilarChannel = createSelector(
  [iSportsState],
  ({ similarChannel }) => similarChannel
);
