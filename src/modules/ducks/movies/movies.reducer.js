import { createReducer } from 'reduxsauce';
import { Types } from './movies.actions';

const INITIAL_STATE = {
  isFetching: false,
  error: null,
  categories: [],
  movie: null,
  movies: [],
  playbackInfo: {},
  paginatorInfo: {
    limit: 10,
    pageNumber: 1
  }
};

export default createReducer(INITIAL_STATE, {
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
