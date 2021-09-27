import { createSelector } from 'reselect';

export const imusicFavoritesState = (state) => state.imusicFavorites;

export const selectUpdated = createSelector([imusicFavoritesState], ({ updated }) => updated);
export const selectIsFavorite = createSelector([imusicFavoritesState], ({ album }) => {
  if (!album) return false;
  if (typeof album.is_favorite === 'undefined') return false;

  return album.is_favorite;
});
