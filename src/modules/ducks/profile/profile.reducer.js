import { createReducer } from 'reduxsauce';
import { Types } from './profile.actions';

const INITIAL_STATE = {
  error: null,
  isFetching: false,
  profile: null,
  updateResponse: null,
  updated: false
};

export default createReducer(INITIAL_STATE, {
  [Types.START]: (state) => {
    return {
      ...state,
      updated: false
    };
  },
  [Types.GET]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: true
    };
  },
  [Types.GET_SUCCESS]: (state, action) => {
    const { profile } = action.data;
    return {
      ...state,
      error: null,
      isFetching: false,
      profile
    };
  },
  [Types.GET_FAILURE]: (state, action) => {
    return {
      ...state,
      error: action.error,
      isFetching: false
    };
  },
  [Types.UPDATE_START]: (state) => {
    return {
      ...state,
      updated: false
    };
  },
  [Types.UPDATE]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: true
    };
  },
  [Types.UPDATE_SUCCESS]: (state, action) => {
    const { updateResponse } = action.data;
    return {
      ...state,
      error: null,
      isFetching: false,
      updateResponse,
      updated: true
    };
  },
  [Types.UPDATE_FAILURE]: (state, action) => {
    return {
      ...state,
      error: action.error,
      isFetching: false,
      updateResponse: null,
      updated: false
    };
  },
  [Types.REMOVE_CURRENT_USER]: (state) => {
    return { ...state, profile: null };
  }
});
