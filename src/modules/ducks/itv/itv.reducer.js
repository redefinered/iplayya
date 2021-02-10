import { createReducer } from 'reduxsauce';
import { Types } from './itv.actions';

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

  /// channels per category
  // changes depending on user click in itv screen
  channels: []
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
      paginatorInfo
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
  [Types.SET_PAGINATOR_INFO]: (state, action) => {
    return {
      ...state,
      paginatorInfo: action.data
    };
  },
  [Types.RESET]: () => {
    return { ...INITIAL_STATE };
  }
});
