import { createReducer } from 'reduxsauce';
import { Types } from './imusic-search.actions';
// import uniqBy from 'lodash/unionBy';
// import orderBy from 'lodash/orderBy';

const INITIAL_STATE = {
  isFetching: false,
  error: null,
  isSearching: false,
  searchNoResult: false,
  searchResults: [],
  similarGenre: [],
  paginator: {
    limit: 10,
    pageNumber: 1,
    orderBy: 'number',
    order: 'asc'
  }
};

export default createReducer(INITIAL_STATE, {
  [Types.SET_IS_SEARCHING]: (state, action) => ({ ...state, isSearching: action.isSearching }),
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
      error: null,
      searchNoResult: false
    };
  },
  [Types.SEARCH_SUCCESS]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      searchResults: action.data,
      searchNoResult: false
    };
  },
  [Types.SEARCH_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error,
      searchResults: [],
      searchNoResult: true
    };
  },

  // similarGenre
  [Types.GET_SIMILAR_GENRE_START]: (state) => {
    return {
      ...state,
      isFetching: false,
      error: null,
      similarGenre: []
    };
  },
  [Types.GET_SIMILAR_GENRE]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_SIMILAR_GENRE_SUCCESS]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: null,
      similarGenre: action.data
    };
  },
  [Types.GET_SIMILAR_GENRE_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error,
      similarGenre: []
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
      paginator: {
        limit: 10,
        pageNumber: 1,
        orderBy: 'number',
        order: 'asc'
      }
    };
  }
});
