import { createReducer } from 'reduxsauce';
import { Types } from './imusic-favorites.actions';

const INITIAL_STATE = {
  isFetching: false,
  error: null,
  favorites: [],
  paginator: { pageNumber: 1, limit: 10 },
  updated: false
};

export default createReducer(INITIAL_STATE, {
  [Types.GET_FAVORITES]: (state) => {
    return { ...state, isFetching: true, error: null };
  },
  [Types.GET_FAVORITES_SUCCESS]: (state, action) => {
    const { data, nextPaginator: paginator } = action;
    return { ...state, isFetching: false, favorites: data, paginator };
  },
  [Types.GET_FAVORITES_FAILURE]: (state, action) => {
    return { ...state, isFetching: false, error: action.error };
  },

  [Types.ADD_TRACK_TO_FAVORITES]: (state) => {
    return { ...state, isFetching: true, error: null, updated: false };
  },
  [Types.ADD_TRACK_TO_FAVORITES_SUCCESS]: (state) => {
    return { ...state, isFetching: false, updated: true };
  },
  [Types.ADD_TRACK_TO_FAVORITES_FAILURE]: (state, action) => {
    return { ...state, isFetching: false, updated: false, error: action.error };
  },

  [Types.ADD_ALBUM_TO_FAVORITES_START]: (state) => ({ ...state, updated: false }),
  [Types.ADD_ALBUM_TO_FAVORITES]: (state) => {
    return { ...state, isFetching: true, error: null, updated: false };
  },
  [Types.ADD_ALBUM_TO_FAVORITES_SUCCESS]: (state) => {
    return { ...state, isFetching: false, updated: true };
  },
  [Types.ADD_ALBUM_TO_FAVORITES_FAILURE]: (state, action) => {
    return { ...state, isFetching: false, updated: false, error: action.error };
  }
});
