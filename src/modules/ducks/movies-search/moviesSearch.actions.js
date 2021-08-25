import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    searchStart: [],
    search: ['input'],
    searchSuccess: ['data'],
    searchFailure: ['error'],

    getMoviesStart: [],
    getMovies: ['paginatorInfo', 'categoryPaginator'],
    getMoviesSuccess: ['movies', 'categoryPaginator'],
    getMoviesFailure: ['error'],
    resetCategoryPaginator: [],

    //recent search
    updateRecentSearch: ['term']
  },
  { prefix: '@MoviesSearch/' }
);

export { Types, Creators };
