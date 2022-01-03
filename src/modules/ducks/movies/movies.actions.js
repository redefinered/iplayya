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

    getFavoriteMovies: ['input'],
    getFavoriteMoviesSuccess: ['favoriteVideos'],
    getFavoriteMoviesFailure: ['error'],
    resetFavoritesPaginator: null,

    addMovieToFavoritesStart: [],
    addMovieToFavorites: ['videoId'],
    addMovieToFavoritesSuccess: [],
    addMovieToFavoritesFailure: ['error'],

    // remove movies from favorites
    resetRemoved: null,
    removeFromFavorites: ['videoIds'],
    removeFromFavoritesSuccess: null,
    removeFromFavoritesFailure: ['error'],

    setIsSearching: ['isSearching'], /// is searching for favorites

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
