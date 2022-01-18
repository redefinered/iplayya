import { createSelector } from 'reselect';

export const imusicSearchState = (state) => state.imusicSearch;

export const selectError = createSelector([imusicSearchState], ({ error }) => error);

export const selectIsFetching = createSelector([imusicSearchState], ({ isFetching }) => isFetching);

export const selectSearchResults = createSelector(
  [imusicSearchState],
  ({ searchResults }) => searchResults
);

export const selectSimilarGenre = createSelector(
  [imusicSearchState],
  ({ similarGenre }) => similarGenre
);

export const selectIsSearching = createSelector(
  [imusicSearchState],
  ({ isSearching }) => isSearching
);
export const selectSearchNorResult = createSelector(
  [imusicSearchState],
  ({ searchNoResult }) => searchNoResult
);

export const selectPaginator = createSelector([imusicSearchState], ({ paginator }) => paginator);
