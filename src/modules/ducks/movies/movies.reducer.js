import { createReducer } from 'reduxsauce';
import { Types } from './movies.actions';

const INITIAL_STATE = {
  isFetching: false,
  error: null,
  categories: [],
  movie: null,

  // movies is going to be a collection of movies grouped into categories
  movies: [],

  // information about currently playing movie
  playbackInfo: {},

  // paginators for movies sections in the main imovie screen
  paginatorInfo: []
};

export default createReducer(INITIAL_STATE, {
  [Types.SETUP_PAGINATOR_INFO]: (state, action) => {
    const { paginatorInfo } = action;
    return {
      ...state,
      paginatorInfo
    };
  },
  [Types.GET_CATEGORIES_SUCCESS]: (state, action) => {
    const { categories } = action.data;
    return {
      ...state,
      categories
    };
  },
  [Types.GET_MOVIES_BY_CATEGORIES]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_MOVIES_BY_CATEGORIES_SUCCESS]: (state, action) => {
    const { movies } = action;

    return {
      ...state,
      isFetching: false,
      error: null,
      movies
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
  }
});
