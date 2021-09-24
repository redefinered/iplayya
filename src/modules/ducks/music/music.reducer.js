import { createReducer } from 'reduxsauce';
import { Types } from './music.actions';
import {
  updateMusicState,
  updatePaginatorInfo,
  setupPaginator,
  shuffleTrackNumbers
} from './music.utils';
import uniqBy from 'lodash/uniqBy';
import orderBy from 'lodash/orderBy';
import { repeatTypes } from './music.utils';

const INITIAL_STATE = {
  isFetching: false,
  error: null,
  genres: [],
  albums: [], // grouped with genres
  album: null,

  paused: false,
  nowPlaying: null,
  playlist: [],
  shuffle: false,
  nowPlayingLayoutInfo: null,
  isBackgroundMode: false,
  repeat: repeatTypes.find(({ value }) => value === 'none'),
  seekValue: 0,

  playbackProgress: 0,
  playbackInfo: {},

  // paginators for musc sections in the main imusic screen
  paginatorInfo: [],

  genrePaginator: {
    page: 1,
    limit: 5
  }
};

export default createReducer(INITIAL_STATE, {
  [Types.SET_SEEK_VALUE]: (state, { seekValue }) => {
    return { ...state, seekValue };
  },
  [Types.CLEAR_REPEAT]: (state) => {
    return { ...state, repeat: repeatTypes.find(({ value }) => value === 'none') };
  },
  [Types.CYCLE_REPEAT]: (state) => {
    const { repeat } = state;

    let nextRepeat = repeat.order + 1;

    if (nextRepeat > repeatTypes.length) {
      nextRepeat = 1;
    }
    return { ...state, repeat: repeatTypes.find(({ order }) => order === nextRepeat) };
  },
  [Types.TOGGLE_SHUFFLE]: (state) => {
    const { shuffle } = state;
    const { tracks } = state.album;

    if (shuffle) {
      return {
        ...state,
        shuffle: false,
        playlist: tracks.map(({ number, ...rest }) => ({
          sequence: parseInt(number),
          number,
          ...rest
        }))
      };
    } else {
      const trackNumbers = tracks.map(({ number }) => number);
      const shuffledTrackNumbers = shuffleTrackNumbers(trackNumbers);

      // tracks list if shuffle is switched on
      const tracksWithShuffledNumbers = tracks.map((track, i) => ({
        sequence: shuffledTrackNumbers[i],
        ...track
      }));

      return { ...state, shuffle: true, playlist: tracksWithShuffledNumbers };
    }
  },
  [Types.SET_PAUSED]: (state, action) => {
    return { ...state, paused: action.isPaused };
  },
  [Types.SET_PROGRESS]: (state, action) => {
    return { ...state, playbackProgress: action.progress };
  },
  [Types.UPDATE_PLAYBACK_INFO]: (state, action) => {
    return { ...state, playbackInfo: action.playbackInfo };
  },

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

  /// get tracks by album
  // [Types.GET_TRACKS_BY_ALBUM_START]: (state) => {
  //   return { ...state, album: null };
  // },
  // [Types.GET_TRACKS_BY_ALBUM]: (state) => {
  //   return { ...state, isFetching: true, error: null, album: null };
  // },
  // [Types.GET_TRACKS_BY_ALBUM_SUCCESS]: (state, action) => {
  //   return { ...state, isFetching: false, album: action.album };
  // },
  // [Types.GET_TRACKS_BY_ALBUM_FAILURE]: (state, action) => {
  //   return { ...state, isFetching: false, album: null, error: action.error };
  // },

  /// album details
  [Types.GET_ALBUM_DETAILS_START]: (state) => ({ ...state, album: null }),
  [Types.GET_ALBUM_DETAILS]: (state) => {
    return { ...state, isFetching: true, error: null };
  },
  [Types.GET_ALBUM_DETAILS_SUCCESS]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      album: action.album
    };
  },
  [Types.GET_ALBUM_DETAILS_FAILURE]: (state, action) => {
    return { ...state, isFetching: false, album: null, error: action.error };
  },

  [Types.SET_NOW_PLAYING]: (state, action) => {
    const { track, newPlaylist } = action;

    /// if playlist ends this block should get executed
    if (!track && typeof newPlaylist === 'undefined') {
      return {
        ...state,
        nowPlaying: null,
        playlist: [],
        seekValue: 0
      };
    }

    const { shuffle, playlist } = state;
    const { tracks } = state.album;

    const trackNumbers = tracks.map(({ number }) => number);
    const shuffledTrackNumbers = shuffleTrackNumbers(trackNumbers);

    // tracks list if shuffle is switched on
    const tracksWithShuffledNumbers = tracks.map((track, i) => ({
      sequence: shuffledTrackNumbers[i],
      ...track
    }));

    /// tracks list if shuffle is NOT switched on
    const tracksWithNormalSequence = tracks.map(({ number, ...rest }) => ({
      sequence: parseInt(number),
      number,
      ...rest
    }));

    const createdPlaylist = shuffle ? tracksWithShuffledNumbers : tracksWithNormalSequence;

    const next = track ? track.sequence : 1;

    const findThis = shuffle ? next : parseInt(track.number);

    return {
      ...state,
      nowPlaying: newPlaylist
        ? createdPlaylist.find(({ sequence }) => parseInt(sequence) === findThis)
        : playlist.find(({ sequence }) => parseInt(sequence) === findThis),
      playlist: newPlaylist ? createdPlaylist : playlist,
      seekValue: 0
    };
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

  [Types.SET_PLAYLIST]: (state) => {
    const { tracks } = state.album;
    const { shuffle } = state;

    const trackNumbers = tracks.map(({ number }) => number);
    const shuffledTrackNumbers = shuffleTrackNumbers(trackNumbers);

    // apply shuffled numbers to tracks
    const tracksWithShuffledNumbers = tracks.map((track, i) => ({
      sequence: shuffledTrackNumbers[i],
      ...track
    }));

    return { ...state, playlist: shuffle ? tracksWithShuffledNumbers : tracks };
  },
  [Types.SET_SHUFFLE_ON]: (state) => {
    return { ...state, shuffle: true };
  },
  [Types.SET_SHUFFLE_OFF]: (state) => {
    const { playlist } = state;
    const normalizedPlaylist = playlist.map(({ number, rest }) => ({ sequence: number, ...rest }));
    return { ...state, shuffle: false, playlist: normalizedPlaylist };
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
    const { genrePaginator } = action;
    let { albums } = action;

    // fixes issue where genre with spaces are ordered first
    albums = albums.map(({ genre, ...rest }) => ({ genre: genre.trim(), ...rest }));

    albums = uniqBy([...state.albums, ...albums], 'id');
    albums = orderBy(albums, 'genre', 'asc');

    // console.log({ albums });
    return {
      ...state,
      isFetching: false,
      error: null,
      albums,
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

  [Types.GET_ALBUMS_BY_GENRES]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_ALBUMS_BY_GENRES_SUCCESS]: (state, action) => {
    const { data: newAlbums, nextPaginator } = action;
    const albums = updateMusicState(state, newAlbums);
    const paginatorInfo = updatePaginatorInfo(state, newAlbums, nextPaginator);
    return {
      ...state,
      isFetching: false,
      error: null,
      albums,
      paginatorInfo
    };
  },
  [Types.GET_ALBUMS_BY_GENRES_FAILURE]: (state, action) => {
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
