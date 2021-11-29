import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    start: null,

    addToFavorites: ['id'],
    addToFavoritesSuccess: null,
    addToFavoritesFailure: ['error'],

    removeFromFavorites: ['channelIds'],
    removeFromFavoritesSuccess: null,
    removeFromFavoritesFailure: ['error'],

    getFavorites: ['input'],
    getFavoritesSuccess: ['favorites'],
    getFavoritesFailure: ['error'],
    resetFavoritesPaginator: null
  },
  { prefix: '@Itv-Favorites/' }
);

export { Types, Creators };
