import { createReducer } from 'reduxsauce';
import { Types } from './profile.actions';

import { Types as AuthTypes } from 'modules/ducks/auth/auth.actions';

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
      updated: false,
      isFetching: false,
      error: null
    };
  },
  [AuthTypes.SIGN_IN_SUCCESS]: (state, action) => {
    return { ...state, profile: action.user, updated: false };
  },
  [Types.GET]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: true
    };
  },
  [Types.GET_SUCCESS]: (state, action) => {
    return {
      ...state,
      error: null,
      isFetching: false,
      profile: action.profile
    };
  },
  [Types.GET_FAILURE]: (state, action) => {
    return {
      ...state,
      error: action.error,
      isFetching: false
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
  [Types.REMOVE_PROFILE]: (state) => {
    return { ...state, profile: null };
  }
});
