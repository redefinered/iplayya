import { createSelector } from 'reselect';

export const iradioFavoritesState = (state) => state.iradioFavorites;

export const selectError = createSelector([iradioFavoritesState], ({ error }) => error);

export const selectIsFetching = createSelector(
  [iradioFavoritesState],
  ({ isFetching }) => isFetching
);

export const selectFavorites = createSelector([iradioFavoritesState], ({ favorites }) => favorites);

export const selectPaginator = createSelector([iradioFavoritesState], ({ paginator }) => paginator);

export const selectAdded = createSelector([iradioFavoritesState], ({ added }) => added);

export const selectRemoved = createSelector([iradioFavoritesState], ({ removed }) => removed);

export const selectAddedToFavorites = createSelector(
  [iradioFavoritesState],
  ({ addedToFavorites }) => addedToFavorites
);
