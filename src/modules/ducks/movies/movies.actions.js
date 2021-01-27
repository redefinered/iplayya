import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    setupPaginatorInfo: ['paginatorInfo'],

    getMovieStart: [],
    getMovie: ['videoId'],
    getMovieSuccess: ['movie'],
    getMovieFailure: ['error'],

    // get movies for each movie category when user opens imovie screen
    getMoviesStart: [],
    getMovies: ['paginatorInfo'],
    getMoviesSuccess: ['movies'],
    getMoviesFailure: ['error'],

    getCategoriesSuccess: ['data'],

    /**
     * get movies by specific categories
     * can be used to get one or multiple categories
     */
    getMoviesByCategories: ['input'],
    getMoviesByCategoriesSuccess: ['data'],
    getMoviesByCategoriesFailure: ['error'],

    playbackStart: [],
    updatePlaybackInfo: ['data'],

    addVideoToContinueWatching: ['data'],

    getFavoriteMovies: [],
    getFavoriteMoviesSuccess: ['data'],
    getFavoriteMoviesFailure: ['error'],

    addMovieToFavoritesStart: ['videoId'],
    addMovieToFavorites: ['videoId'],
    addMovieToFavoritesSuccess: [],
    addMovieToFavoritesFailure: ['error']
  },
  { prefix: '@Movies/' }
);

export { Types, Creators };
