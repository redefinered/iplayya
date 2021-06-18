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

    getAlbumsByGenre: ['input'],
    getAlbumsByGenreSuccess: ['data'],
    getAlbumsByGenreFailure: ['error'],

    // misc
    resetGenrePaginator: null,
    reset: null
  },
  { prefix: '@Music/' }
);

export { Types, Creators };
