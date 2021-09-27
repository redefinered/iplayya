import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    getOne: ['data'],
    getOneSuccess: ['data'],
    getOneFailure: ['error'],

    // get radio stations
    getStart: null,
    get: ['input'],
    getSuccess: ['radioStations', 'nextPaginatorInfo'],
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

    setNowPlaying: ['track'],
    setProgress: ['progress'], // progress in percentage
    setPaused: ['isPaused'], // boolean,
    resetNowPlaying: null,
    setNowPlayingLayoutInfo: ['layoutInfo'],

    searchStart: [],
    search: ['input'],
    searchSuccess: ['data'],
    searchFailure: ['error'],

    // misc
    reset: null,
    setPaginatorInfo: ['data'],
    resetPaginator: null
  },
  { prefix: '@Iradio/' }
);

export { Types, Creators };
