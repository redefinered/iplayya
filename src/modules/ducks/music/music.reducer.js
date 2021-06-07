import { createReducer } from 'reduxsauce';
import { Types } from './music.actions';
import { updateMoviesState, updatePaginatorInfo, setupPaginator } from './music.utils';
import uniq from 'lodash/uniq';

const INITIAL_STATE = {
  isFetching: false,
  error: null,
  genres: [],
  albums: [], // grouped with genres

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
    const { genres } = action.data;
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
  [Types.GET_ALBUMS]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_ALBUMS_SUCCESS]: (state, action) => {
    const { albums, genrePaginator } = action;
    return {
      ...state,
      isFetching: false,
      error: null,
      albums: uniq([...state.albums, ...albums]),
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
