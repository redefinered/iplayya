import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    // setupPaginatorInfo: ['paginatorInfo'],

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

    setEpisode: ['season', 'episode'],

    getCategories: [],
    getCategoriesSuccess: ['data'],
    getCategoriesFailure: ['error'],

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

    /**
     * will have title, status, and progress property
     */
    // updateDownloads: ['downloadTask'],

    // deleteFromDownloadsState: ['videoId'],

    // /// the id argument is the ID to be removed
    // cleanUpDownloadsProgress: ['ids'],

    // updateDownloadsProgress: ['data'],

    // getDownloadsStart: [],
    // getDownloads: ['data'],
    // getDownloadsSuccess: ['data'],
    // getDownloadsFailure: ['error'],

    searchStart: [],
    search: ['input'],
    searchSuccess: ['data'],
    searchFailure: ['error'],

    setPermissionError: ['error'],

    reset: []
  },
  { prefix: '@Movies/' }
);

export { Types, Creators };
