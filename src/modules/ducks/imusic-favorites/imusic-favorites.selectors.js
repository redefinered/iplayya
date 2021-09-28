import { createSelector } from 'reselect';

export const imusicFavoritesState = (state) => state.imusicFavorites;

export const selectError = createSelector([imusicFavoritesState], ({ error }) => error);

export const selectIsFetching = createSelector(
  [imusicFavoritesState],
  ({ isFetching }) => isFetching
);

export const selectFavorites = createSelector([imusicFavoritesState], ({ favorites }) => favorites);

export const selectUpdated = createSelector([imusicFavoritesState], ({ updated }) => updated);
export const selectIsFavorite = createSelector([imusicFavoritesState], ({ album }) => {
  if (!album) return false;
  if (typeof album.is_favorite === 'undefined') return false;

  return album.is_favorite;
});
