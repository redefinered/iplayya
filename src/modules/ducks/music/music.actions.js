import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    getGenres: null,
    getGenresSuccess: ['data'],
    getGenresFailure: ['error'],
    getAlbums: ['paginatorInfo', 'genrePaginator'],
    getAlbumsSuccess: ['data'],
    getAlbumsFailure: ['error'],
    getAlbumsByGenre: ['input'],
    getAlbumsByGenreSuccess: ['data'],
    getAlbumsByGenreFailure: ['error'],
    resetGenrePaginator: null,
    reset: null
  },
  { prefix: '@Music/' }
);

export { Types, Creators };
