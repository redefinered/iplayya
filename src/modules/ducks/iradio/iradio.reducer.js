import { createReducer } from 'reduxsauce';
import { Types } from './iradio.actions';
import uniqBy from 'lodash/unionBy';
import orderBy from 'lodash/orderBy';

const INITIAL_STATE = {
  isFetching: false,
  error: null,
  radioStation: null,
  radioStations: [],
  paginator: {
    limit: 10,
    pageNumber: 1,
    orderBy: 'number',
    order: 'asc'
  },
  recentSearch: [],
  searchResults: [],
  searchResultsPaginator: {
    limit: 10,
    pageNumber: 1,
    orderBy: 'number',
    order: 'asc'
  },

  paused: false,
  nowPlaying: null,
  nowPlayingLayoutInfo: null,
  isBackgroundMode: false,
  playbackProgress: 0
};

export default createReducer(INITIAL_STATE, {
  [Types.START]: (state) => {
    return {
      ...state,
      radioStations: [],
      paginator: {
        limit: 10,
        pageNumber: 1,
        orderBy: 'number',
        order: 'asc'
      }
    };
  },
  [Types.GET]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_SUCCESS]: (state, action) => {
    const { radioStations, nextPaginator } = action;

    let updatedRadios = uniqBy([...radioStations, ...state.radioStations], 'id');

    /// convert number property to Int for orderBy function to work
    updatedRadios = updatedRadios.map(({ number, ...rest }) => {
      return { number: parseInt(number), ...rest };
    });

    return {
      ...state,
      isFetching: false,
      error: null,
      radioStations: orderBy(updatedRadios, 'number', 'asc'),
      paginator: nextPaginator
    };
  },
  [Types.GET_FAILURE]: (state, action) => {
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
  /// now-playing
  [Types.SET_PAUSED]: (state, action) => {
    return { ...state, paused: action.isPaused };
  },
  [Types.SET_PROGRESS]: (state, action) => {
    return { ...state, playbackProgress: action.progress };
  },
  [Types.SET_NOW_PLAYING_LAYOUT_INFO]: (state, action) => {
    return { ...state, nowPlayingLayoutInfo: action.layoutInfo };
  },
  [Types.SET_NOW_PLAYING]: (state, action) => {
    const { track } = action;
    return { ...state, nowPlaying: track };
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
    const { results, nextPaginatorInfo } = action;

    const updatedSearchResults = uniqBy([...results, ...state.searchResults], 'id');

    // console.log({ loc: 'reducer', ...nextPaginatorInfo });

    return {
      ...state,
      isFetching: false,
      searchResults: orderBy(updatedSearchResults, 'number', 'asc'),
      searchResultsPaginator: { orderBy: 'number', order: 'asc', ...nextPaginatorInfo }
    };
  },
  [Types.SEARCH_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
      // searchResults: []
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
  [Types.RESET_SEARCH_RESULTS_PAGINATOR]: (state) => {
    return {
      ...state,
      searchResultsPaginator: {
        limit: 10,
        pageNumber: 1,
        orderBy: 'number',
        order: 'asc'
      }
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

  // [Types.RESET]: (state) => {
  //   return { ...state, ...INITIAL_STATE };
  // }
});
