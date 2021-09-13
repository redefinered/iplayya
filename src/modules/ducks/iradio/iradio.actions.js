import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    getOne: ['data'],
    getOneSuccess: ['data'],
    getOneFailure: ['error'],

    // get radio stations
    get: ['data'],
    getSuccess: ['data'],
    getFailure: ['error'],

    // get radio stations
    getFavorites: ['data'],
    getFavoritesSuccess: ['data'],
    getFavoritesFailure: ['error'],

    // add to favorites
    addToFavorites: ['radioId'],
    addToFavoritesSuccess: [],
    addToFavoritesFailure: ['error'],

    // remove from favorites
    removeFromFavorites: ['radioIds'],
    removeFromFavoritesSuccess: null,
    removeFromFavoritesFailure: ['error'],

    // misc
    playbackStart: [],
    updatePlaybackInfo: ['data'],

    searchStart: [],
    search: ['input'],
    searchSuccess: ['data'],
    searchFailure: ['error']
  },
  { prefix: '@Iradio/' }
);

export { Types, Creators };
