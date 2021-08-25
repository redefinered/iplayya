import { createReducer } from 'reduxsauce';
import { Types } from './moviesSearch.actions';
import uniq from 'lodash/uniq';

const INITIAL_STATE = {
  isFetching: false,
  error: null,
  searchResults: [],
  recentSearch: [],
  movies: [],
  categoryPaginator: {
    page: 1,
    limit: 5
  }
};

export default createReducer(INITIAL_STATE, {
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
  [Types.GET_MOVIES_START]: (state) => {
    // const { paginatorInfo } = INITIAL_STATE;
    return {
      ...state,
      isFetching: false,
      error: null
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
      movies: uniq([...state.movies, ...movies]),
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
  [Types.RESET_CATEGORY_PAGINATOR]: (state) => {
    return {
      ...state,
      categoryPaginator: { page: 1, limit: 5 }
    };
  }
});
