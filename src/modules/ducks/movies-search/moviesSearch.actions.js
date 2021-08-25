import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    searchStart: null,
    search: ['input'],
    searchSuccess: ['data'],
    searchFailure: ['error'],

    getMoviesStart: null,
    getMovies: ['paginatorInfo', 'categoryPaginator'],
    getMoviesSuccess: ['movies', 'categoryPaginator'],
    getMoviesFailure: ['error'],
    resetCategoryPaginator: null,

    //recent search
    updateRecentSearch: ['term']
  },
  { prefix: '@MoviesSearch/' }
);

export { Types, Creators };
