import { createReducer } from 'reduxsauce';
import { Types } from './iradio.actions';
import uniqBy from 'lodash/unionBy';
import orderBy from 'lodash/orderBy';

const INITIAL_STATE = {
  isFetching: false,
  error: null,
  radioStation: null,
  radioStations: [],
  favorites: [],
  playbackInfo: {},
  addedToFavorites: false,
  removedFromFavorites: false,
  searchResults: [],
  paginator: {
    limit: 10,
    pageNumber: 1,
    orderBy: 'number',
    order: 'asc'
  },
  paginatorInfo: {
    limit: 10,
    pageNumber: 1
  },

  paused: false,
  nowPlaying: null,
  nowPlayingLayoutInfo: null,
  isBackgroundMode: false,
  playbackProgress: 0
};

export default createReducer(INITIAL_STATE, {
  [Types.GET_START]: (state) => {
    return {
      ...state,
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
    const { radioStations, nextPaginatorInfo } = action;

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
      paginator: Object.assign(state.paginator, nextPaginatorInfo),
      addedToFavorites: false,
      removedFromFavorites: false
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
      error: null,
      removedFromFavorites: false
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
      error: action.error,
      removedFromFavorites: false
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
      paginator: action.data
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
  },
  [Types.RESET]: (state) => {
    return { ...state, ...INITIAL_STATE };
  }
});
