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

    setNowPlaying: ['track'],
    resetNowPlaying: null,
    setNowPlayingBackgroundMode: ['isBackgroundMode'],
    setNowPlayingLayoutInfo: ['layoutInfo'],

    // misc
    resetGenrePaginator: null,
    reset: null
  },
  { prefix: '@Music/' }
);

export { Types, Creators };
