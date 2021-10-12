import { createReducer } from 'reduxsauce';
import { Types } from './imusic-search.actions';
// import uniqBy from 'lodash/unionBy';
// import orderBy from 'lodash/orderBy';

const INITIAL_STATE = {
  isFetching: false,
  error: null,
  recentSearch: [],
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
  [Types.UPDATE_RECENT_SEARCH]: (state, action) => {
    let newRecentSearch = [];
    if (state.recentSearch.findIndex((x) => x === action.term) >= 0) {
      newRecentSearch = state.recentSearch;
    } else {
      newRecentSearch = [action.term, ...state.recentSearch];
    }
    return {
      ...state,
      recentSearch: newRecentSearch.splice(0, 10)
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
