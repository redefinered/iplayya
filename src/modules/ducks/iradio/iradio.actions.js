import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    start: null,

    getOne: ['data'],
    getOneSuccess: ['data'],
    getOneFailure: ['error'],

    // get radio stations
    get: ['input'],
    getSuccess: ['radioStations', 'nextPaginator'],
    getFailure: ['error'],

    // misc
    playbackStart: [],
    updatePlaybackInfo: ['data'],

    setNowPlaying: ['track'],
    setProgress: ['progress'], // progress in percentage
    setPaused: ['isPaused'], // boolean,
    resetNowPlaying: null,
    setNowPlayingLayoutInfo: ['layoutInfo'],
    setNowPlayingBackgroundMode: ['isRadioBackgroundMode'],
    switchInIradioScreen: ['value'],
    setIradioBottomNavLayout: ['layout'],

    searchStart: null,
    search: ['input', 'shouldIncrement'],
    searchSuccess: ['results', 'nextPaginatorInfo'],
    searchFailure: ['error'],
    resetSearchResultsPaginator: null,

    //recent search
    updateRecentSearch: ['term'],

    // misc
    reset: null,
    resetPaginator: null
  },
  { prefix: '@Iradio/' }
);

export { Types, Creators };
