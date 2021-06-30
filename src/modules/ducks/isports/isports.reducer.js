import { createReducer } from 'reduxsauce';
import { Types } from './isports.actions';

const INITIAL_STATE = {
  isFetching: false,
  error: null,
  genres: [],
  paginatorInfo: {
    limit: 10,
    pageNumber: 1
  },

  // random channels from getChannelsByCategory
  featuredChannels: [],

  channel: null,
  /// channels per category
  // changes depending on user click in itv screen
  channels: [],

  addedToFavorites: false,
  removedFromFavorites: false,

  favorites: [],

  searchResults: []
};

export default createReducer(INITIAL_STATE, {
  [Types.GET_GENRES]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_GENRES_SUCCESS]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: null,
      genres: action.data
    };
  },
  [Types.GET_GENRES_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
    };
  },
  [Types.GET_CHANNEL]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_CHANNEL_SUCCESS]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: null,
      channel: action.data
    };
  },
  [Types.GET_CHANNEL_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
    };
  },
  [Types.GET_CHANNELS]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_CHANNELS_SUCCESS]: (state, action) => {
    const { channels, nextPaginatorInfo } = action.data;

    /// reference to current state paginator info object
    const currentPaginator = state.paginatorInfo;

    /// update paginator info
    const paginatorInfo = Object.assign(currentPaginator, nextPaginatorInfo);

    return {
      ...state,
      isFetching: false,
      error: null,
      channels,
      paginatorInfo,
      addedToFavorites: false,
      removedFromFavorites: false
    };
  },
  [Types.GET_CHANNELS_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
    };
  },
  [Types.GET_CHANNELS_BY_CATEGORIES]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_CHANNELS_BY_CATEGORIES_SUCCESS]: (state, action) => {
    const { channels, nextPaginatorInfo } = action.data;

    /// reference to current state paginator info object
    const currentPaginator = state.paginatorInfo;

    /// update paginator info
    const paginatorInfo = Object.assign(currentPaginator, nextPaginatorInfo);

    return {
      ...state,
      isFetching: false,
      error: null,
      channels,
      paginatorInfo
    };
  },
  [Types.GET_CHANNELS_BY_CATEGORIES_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
    };
  },

  // add to favorites
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
      error: action.error
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

  /// get favorites
  [Types.GET_FAVORITES]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_FAVORITES_SUCCESS]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: null,
      addedToFavorites: false,
      removedFromFavorites: false,
      favorites: action.data
    };
  },
  [Types.GET_FAVORITES_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
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

  // misc
  [Types.SET_PAGINATOR_INFO]: (state, action) => {
    return {
      ...state,
      paginatorInfo: action.data
    };
  },
  [Types.RESET_PAGINATOR]: (state) => {
    return {
      ...state,
      paginatorInfo: { limit: 10, pageNumber: 1 }
    };
  },
  [Types.RESET]: () => {
    return { ...INITIAL_STATE };
  }
});