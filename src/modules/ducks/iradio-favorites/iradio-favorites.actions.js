import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    start: null,
    getFavorites: ['input'],
    // getFavoritesSuccess: ['data', 'nextPaginator'],
    getFavoritesSuccess: ['favorites'],
    getFavoritesFailure: ['error'],

    addToFavorites: ['radio'],
    addToFavoritesSuccess: ['radio'],
    addToFavoritesFailure: ['error'],

    removeFromFavorites: ['radios'],
    removeFromFavoritesSuccess: ['radios'],
    removeFromFavoritesFailure: ['error'],

    resetPaginator: null,
    resetUpdateIndicators: null
  },
  { prefix: '@IradioFavorites/' }
);

export { Types, Creators };
