import { createReducer } from 'reduxsauce';
import { Types } from './radio.actions';

const INITIAL_STATE = {
  isFetching: false,
  error: null,
  radioStation: null,
  radioStations: [],
  playbackInfo: null,
  paginatorInfo: {
    limit: null,
    pageNumber: null
  }
};

export default createReducer(INITIAL_STATE, {
  [Types.GET]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_SUCCESS]: (state, action) => {
    const { radioStations } = action.data;

    return {
      ...state,
      isFetching: false,
      error: null,
      radioStations
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
  }
});
