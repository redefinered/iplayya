import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    setupPaginatorInfo: ['paginatorInfo'],

    // get movies for each movie category when user opens imovie screen
    getMovies: ['categories'],
    getMoviesSuccess: ['movies'],
    getMoviesFailure: ['error'],

    getCategoriesSuccess: ['data'],

    /**
     * get movies by specific categories
     * can be used to get one or multiple categories
     */
    getMoviesByCategories: ['input'],
    getMoviesByCategoriesSuccess: ['movies'],
    getMoviesByCategoriesFailure: ['error'],

    playbackStart: [],
    updatePlaybackInfo: ['data']
  },
  { prefix: '@Movie/' }
);

export { Types, Creators };
