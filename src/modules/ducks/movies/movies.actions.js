import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    setPaginatorInfo: ['categories'],
    setEpisode: ['season', 'episode'],

    getMovieStart: [],
    getMovie: ['videoId'],
    getMovieSuccess: ['movie'],
    getMovieFailure: ['error'],

    // get movies for each movie category when user opens imovie screen
    getMoviesStart: [],
    getMovies: ['paginatorInfo', 'categoryPaginator'],
    getMoviesSuccess: ['movies', 'categoryPaginator'],
    getMoviesFailure: ['error'],
    resetCategoryPaginator: [],

    // getCategories: [],
    // getCategoriesSuccess: ['categories'],
    // getCategoriesFailure: ['error'],

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

    addMovieToFavoritesStart: [],
    addMovieToFavorites: ['videoId'],
    addMovieToFavoritesSuccess: [],
    addMovieToFavoritesFailure: ['error'],

    // remove movies from favorites
    removeFromFavorites: ['videoIds'],
    removeFromFavoritesSuccess: [],
    removeFromFavoritesFailure: ['error'],

    searchStart: [],
    search: ['input'],
    searchSuccess: ['data'],
    searchFailure: ['error'],

    //recent search
    updateRecentSearch: ['movie'],
    clearRecentSearch: null,
    resetSearchResultsPaginator: null,

    getSimilarMoviesStart: [],
    getSimilarMovies: ['input'],
    getSimilarMoviesSuccess: ['data'],
    getSimilarMoviesFailure: ['error'],

    setPermissionError: ['error'],

    reset: null
  },
  { prefix: '@Movies/' }
);

export { Types, Creators };
