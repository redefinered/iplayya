import { createReducer } from 'reduxsauce';
import { Types } from './movies.actions';
import { updateMoviesState, updatePaginatorInfo, setupPaginator } from './movies.utils';
import uniqBy from 'lodash/uniqBy';

// import { setupPaginator } from 'screens/imovie/imovie.utils';

const INITIAL_STATE = {
  isFetching: false,
  error: null,
  categories: [],
  movie: null,
  favoriteVideos: [],

  // movies is going to be a collection of movies grouped into categories
  movies: [],

  // information about currently playing movie
  playbackInfo: {},

  // paginators for movies sections in the main imovie screen
  paginatorInfo: [],

  categoryPaginator: {
    page: 1,
    limit: 5
  },

  // if a movie is added to favorites
  updatedFavorites: false,
  removedFromFavorites: false,

  searchResults: [],
  similarMovies: [],

  currentEpisode: null
};

export default createReducer(INITIAL_STATE, {
  [Types.SET_EPISODE]: (state, action) => {
    const { season, episode } = action;
    return {
      ...state,
      currentEpisode: { season, episode }
    };
  },
  [Types.GET_MOVIE_START]: (state) => {
    return {
      ...state,
      error: null,
      movie: null,
      currentEpisode: null
    };
  },
  [Types.GET_MOVIE]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_MOVIE_SUCCESS]: (state, action) => {
    const { movie } = action;
    return {
      ...state,
      isFetching: false,
      error: null,
      movie
    };
  },
  [Types.GET_MOVIE_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
    };
  },
  /// reset paginatorInfo so initial query
  [Types.GET_MOVIES_START]: (state) => {
    // const { paginatorInfo } = INITIAL_STATE;
    return {
      ...state,
      isFetching: false,
      error: null,
      categoryPaginator: { page: 1, limit: 10 }
      // movies: []
      // paginatorInfo
    };
  },
  // get movies and update paginator i.e. increment pageNumber
  [Types.GET_MOVIES]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_MOVIES_SUCCESS]: (state, action) => {
    const { movies, categoryPaginator } = action;
    return {
      ...state,
      isFetching: false,
      error: null,
      movies: uniqBy([...state.movies, ...movies], 'category'),
      categoryPaginator
    };
  },
  [Types.GET_MOVIES_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error,
      movies: []
    };
  },

  [Types.GET_SIMILAR_MOVIES]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_SIMILAR_MOVIES_SUCCESS]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: null,
      similarMovies: action.data
    };
  },
  [Types.GET_SIMILAR_MOVIES_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error,
      similarMovies: []
    };
  },

  [Types.RESET_CATEGORY_PAGINATOR]: (state) => {
    return {
      ...state,
      categoryPaginator: { page: 1, limit: 5 }
    };
  },
  // setup paginator info
  // [Types.SETUP_PAGINATOR_INFO]: (state, action) => {
  //   const { paginatorInfo } = action;
  //   return {
  //     ...state,
  //     paginatorInfo
  //   };
  // },
  [Types.GET_CATEGORIES]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  // get all categories
  [Types.GET_CATEGORIES_SUCCESS]: (state, action) => {
    const { categories } = action;
    return {
      ...state,
      error: null,
      isFetching: false,
      categories,
      paginatorInfo: setupPaginator(categories)
    };
  },
  [Types.GET_CATEGORIES_FAILURE]: (state, action) => {
    return {
      ...state,
      error: action.error,
      isFetching: false
    };
  },
  // not sure if I need this
  [Types.GET_MOVIES_BY_CATEGORIES]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_MOVIES_BY_CATEGORIES_SUCCESS]: (state, action) => {
    const { newMovies, nextPaginator } = action.data;
    const movies = updateMoviesState(state, newMovies);
    const paginatorInfo = updatePaginatorInfo(state, newMovies, nextPaginator);
    return {
      ...state,
      isFetching: false,
      error: null,
      movies,
      paginatorInfo
    };
  },
  [Types.GET_MOVIES_BY_CATEGORIES_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
    };
  },
  [Types.PLAYBACK_START]: (state) => {
    return {
      ...state,
      playbackInfo: null
    };
  },
  [Types.UPDATE_PLAYBACK_INFO]: (state, action) => {
    const { playbackInfo } = action.data;
    return {
      ...state,
      playbackInfo
    };
  },
  /// add to favorites
  [Types.ADD_MOVIE_TO_FAVORITES]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.ADD_MOVIE_TO_FAVORITES_START]: (state) => {
    return {
      ...state,
      error: null,
      updatedFavorites: false
    };
  },
  [Types.ADD_MOVIE_TO_FAVORITES_SUCCESS]: (state) => {
    return {
      ...state,
      isFetching: false,
      error: null,
      updatedFavorites: true
    };
  },
  [Types.ADD_MOVIE_TO_FAVORITES_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      addedToFavorites: false,
      error: action.error,
      updatedFavorites: false
    };
  },
  // add to favorites
  [Types.REMOVE_FROM_FAVORITES]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.REMOVE_FROM_FAVORITES_SUCCESS]: (state) => {
    return {
      ...state,
      isFetching: false,
      error: null,
      removedFromFavorites: true
    };
  },
  [Types.REMOVE_FROM_FAVORITES_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
    };
  },
  [Types.GET_FAVORITE_MOVIES]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_FAVORITE_MOVIES_SUCCESS]: (state, action) => {
    const { favoriteVideos } = action.data;
    return {
      ...state,
      isFetching: false,
      error: null,
      removedFromFavorites: false,
      updatedFavorites: false,
      favoriteVideos
    };
  },
  [Types.GET_FAVORITE_MOVIES_FAILURE]: (state) => {
    return {
      ...state,
      isFetching: false,
      error: null
    };
  },
  /// search
  [Types.SEARCH_START]: (state) => {
    return {
      ...state,
      isFetching: false,
      error: null,
      searchResults: []
    };
  },
  [Types.SEARCH]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.SEARCH_SUCCESS]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      searchResults: action.data
    };
  },
  [Types.SEARCH_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error,
      searchResults: []
    };
  },
  [Types.RESET]: (state) => {
    return { ...state, ...INITIAL_STATE, categoryPaginator: { page: 1, limit: 10 } };
  }
});
