import { createReducer } from 'reduxsauce';
import { Types } from './music.actions';
import { updateMoviesState, updatePaginatorInfo, setupPaginator } from './music.utils';
import uniqBy from 'lodash/uniqBy';

const INITIAL_STATE = {
  isFetching: false,
  error: null,
  genres: [],
  albums: [], // grouped with genres
  album: null,

  nowPlaying: null,
  nowPlayingLayoutInfo: null,
  isBackgroundMode: false,

  // paginators for musc sections in the main imusic screen
  paginatorInfo: [],

  genrePaginator: {
    page: 1,
    limit: 5
  }
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
    const { genres } = action;
    return {
      ...state,
      isFetching: false,
      error: null,
      genres,
      paginatorInfo: setupPaginator(genres)
    };
  },
  [Types.GET_GENRES_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
    };
  },

  /// get album
  [Types.GET_ALBUM_START]: (state) => {
    return { ...state, album: null };
  },
  [Types.GET_ALBUM]: (state) => {
    return { ...state, isFetching: true, error: null, album: null };
  },
  [Types.GET_ALBUM_SUCCESS]: (state, action) => {
    return { ...state, isFetching: false, album: action.album };
  },
  [Types.GET_ALBUM_FAILURE]: (state, action) => {
    return { ...state, isFetching: false, album: null, error: action.error };
  },

  [Types.SET_NOW_PLAYING]: (state, action) => {
    return { ...state, nowPlaying: action.track };
  },
  [Types.RESET_NOW_PLAYING]: (state) => {
    return { ...state, nowPlaying: null };
  },
  [Types.SET_NOW_PLAYING_BACKGROUND_MODE]: (state, action) => {
    return { ...state, isBackgroundMode: action.isBackgroundMode };
  },
  [Types.SET_NOW_PLAYING_LAYOUT_INFO]: (state, action) => {
    return { ...state, nowPlayingLayoutInfo: action.layoutInfo };
  },

  /// get albums
  [Types.GET_ALBUMS_START]: (state) => {
    return {
      ...state,
      isFetching: false,
      error: null,
      albums: [],
      paginatorInfo: INITIAL_STATE.paginatorInfo
    };
  },
  [Types.GET_ALBUMS]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_ALBUMS_SUCCESS]: (state, action) => {
    const { albums, genrePaginator } = action;
    // console.log({ albums });
    return {
      ...state,
      isFetching: false,
      error: null,
      albums: uniqBy([...state.albums, ...albums], 'id'),
      genrePaginator
    };
  },
  [Types.GET_ALBUMS_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
    };
  },

  [Types.GET_ALBUMS_BY_GENRE]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_ALBUMS_BY_GENRE_SUCCESS]: (state, action) => {
    const { newAlbums, nextPaginator } = action.data;
    const albums = updateMoviesState(state, newAlbums);
    const paginatorInfo = updatePaginatorInfo(state, newAlbums, nextPaginator);
    return {
      ...state,
      isFetching: false,
      error: null,
      albums,
      paginatorInfo
    };
  },
  [Types.GET_ALBUMS_BY_GENRE_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
    };
  },
  [Types.RESET_GENRE_PAGINATOR]: (state) => {
    return {
      ...state,
      genrePaginator: INITIAL_STATE.genrePaginator
    };
  },
  [Types.RESET]: (state) => {
    return { ...state, ...INITIAL_STATE };
  }
});
