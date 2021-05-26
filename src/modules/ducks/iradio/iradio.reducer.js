import { createReducer } from 'reduxsauce';
import { Types } from './iradio.actions';

const INITIAL_STATE = {
  isFetching: false,
  error: null,
  radioStation: null,
  radioStations: [],
  favorites: [],
  playbackInfo: null,
  addedToFavorites: false,
  removedFromFavorites: null,
  searchResults: [],
  paginatorInfo: {
    limit: 10,
    pageNumber: 1
  }
};

export default createReducer(INITIAL_STATE, {
  [Types.GET]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_SUCCESS]: (state, action) => {
    const { radioStations } = action.data;

    return {
      ...state,
      isFetching: false,
      error: null,
      radioStations,
      addedToFavorites: false,
      removedFromFavorites: null
    };
  },
  [Types.GET_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
    };
  },
  [Types.GET_FAVORITES]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_FAVORITES_SUCCESS]: (state, action) => {
    const { favorites } = action.data;

    return {
      ...state,
      isFetching: false,
      error: null,
      favorites,
      addedToFavorites: false,
      removedFromFavorites: null
    };
  },
  [Types.GET_FAVORITES_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
    };
  },
  [Types.ADD_TO_FAVORITES]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.ADD_TO_FAVORITES_SUCCESS]: (state) => {
    return {
      ...state,
      isFetching: false,
      error: null,
      addedToFavorites: true
    };
  },
  [Types.ADD_TO_FAVORITES_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error,
      addedToFavorites: false
    };
  },
  [Types.REMOVE_FROM_FAVORITES]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.REMOVE_FROM_FAVORITES_SUCCESS]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: null,
      removedFromFavorites: action.radioId
    };
  },
  [Types.REMOVE_FROM_FAVORITES_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error,
      removedFromFavorites: null
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
  }
});
