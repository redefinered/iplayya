import { createSelector } from 'reselect';

export const moviesSearchState = (state) => state.moviesSearch;

export const selectError = createSelector([moviesSearchState], ({ error }) => error);

export const selectIsFetching = createSelector([moviesSearchState], ({ isFetching }) => isFetching);

export const selectSearchResults = createSelector(
  [moviesSearchState],
  ({ searchResults }) => searchResults
);

export const selectRecentSearch = createSelector(
  [moviesSearchState],
  ({ recentSearch }) => recentSearch
);

export const selectMovies = createSelector([moviesSearchState], ({ movies }) => movies);

export const selectPaginatorInfo = createSelector(
  [moviesSearchState],
  ({ paginatorInfo }) => paginatorInfo
);
