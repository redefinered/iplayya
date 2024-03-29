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

    // getTracksByAlbumStart: null,
    // getTracksByAlbum: ['album'],
    // getTracksByAlbumSuccess: ['album'],
    // getTracksByAlbumFailure: ['error'],

    getAlbumDetailsStart: null,
    getAlbumDetails: ['albumId'],
    getAlbumDetailsSuccess: ['album'],
    getAlbumDetailsFailure: ['error'],

    getAlbumsByGenres: ['input'],
    getAlbumsByGenresSuccess: ['data', 'nextPaginator'],
    getAlbumsByGenresFailure: ['error'],

    setNowPlaying: ['track', 'newPlaylist'],
    setProgress: ['progress'], // progress in percentage
    setPaused: ['isPaused'], // boolean
    updatePlaybackInfo: ['playbackInfo'],
    switchInImusicScreen: ['value'],
    setImusicBottomNavLayout: ['layout'],
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
