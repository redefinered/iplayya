import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    getGenres: null,
    getGenresSuccess: ['genres'],
    getGenresFailure: ['error'],

    getAlbumsStart: null,
    getAlbums: ['paginatorInfo', 'genrePaginator'],
    getAlbumsSuccess: ['albums', 'genrePaginator'],
    getAlbumsFailure: ['error'],

    getAlbumStart: null,
    getAlbum: ['album'],
    getAlbumSuccess: ['album'],
    getAlbumFailure: ['error'],

    getAlbumsByGenre: ['input'],
    getAlbumsByGenreSuccess: ['data'],
    getAlbumsByGenreFailure: ['error'],

    addToFavorites: ['input'],
    addToFavoritesSuccess: ['data'],
    addToFavoritesFailure: ['error'],

    setNowPlaying: ['track', 'newPlaylist'],
    setProgress: ['progress'], // progress in percentage
    setPaused: ['isPaused'], // boolean
    updatePlaybackInfo: ['playbackInfo'],
    resetNowPlaying: null,
    setNowPlayingBackgroundMode: ['isBackgroundMode'],
    setNowPlayingLayoutInfo: ['layoutInfo'],
    setPlaylist: null,
    setShuffleOn: null,
    setShuffleOff: null,
    toggleShuffle: null,
    cycleRepeat: null,
    clearRepeat: null,
    setSeekValue: ['seekValue'],

    // misc
    resetGenrePaginator: null,
    reset: null
  },
  { prefix: '@Music/' }
);

export { Types, Creators };
