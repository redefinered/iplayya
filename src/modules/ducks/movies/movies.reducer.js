import { createReducer } from 'reduxsauce';
import { Types } from './movies.actions';
import { updateMoviesState, updatePaginatorInfo } from './movies.utils';

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

  // if a movie is added to favorites
  updatedFavorites: false,
  removedFromFavorites: false,

  // download tasks
  downloads: {},

  // downloads progress
  downloadsProgress: [],

  // when movie is downloading
  // downloading: false,

  // data for downloaded movies where we get properties like title, id, etc...
  downloadsData: [],

  searchResults: []
};

export default createReducer(INITIAL_STATE, {
  [Types.GET_MOVIE_START]: (state) => {
    return {
      ...state,
      isFetching: false,
      error: null,
      movie: null
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
    return {
      ...state,
      isFetching: false,
      error: null,
      paginatorInfo: []
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
    const { movies } = action;

    return {
      ...state,
      isFetching: false,
      error: null,
      movies
    };
  },
  [Types.GET_MOVIES_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
    };
  },

  // setup paginator info
  [Types.SETUP_PAGINATOR_INFO]: (state, action) => {
    const { paginatorInfo } = action;
    return {
      ...state,
      paginatorInfo
    };
  },

  // get all categories
  [Types.GET_CATEGORIES_SUCCESS]: (state, action) => {
    const { categories } = action.data;
    return {
      ...state,
      error: null,
      isFetching: false,
      categories
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
      isFetching: false,
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
  [Types.UPDATE_DOWNLOADS]: (state, action) => {
    return {
      ...state,
      downloads: action.data
    };
  },
  [Types.UPDATE_DOWNLOADS_PROGRESS]: (state, action) => {
    const { id, ...progress } = action.data;
    return {
      ...state,
      downloadsProgress: [...state.downloadsProgress, { id, ...progress }]
    };
  },
  [Types.GET_DOWNLOADS]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_DOWNLOADS_SUCCESS]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: null,
      downloadsData: action.data
    };
  },
  [Types.GET_DOWNLOADS_FAILURE]: (state) => {
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
  [Types.RESET]: () => {
    return { ...INITIAL_STATE };
  }
});
