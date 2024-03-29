import { createReducer } from 'reduxsauce';
import { Types } from './password.actions';

const INITIAL_STATE = {
  error: null,
  isFetching: false,
  updateParams: null,
  updated: false,
  updateResponse: null,
  getLinkResponse: null
};

export default createReducer(INITIAL_STATE, {
  [Types.START]: (state) => {
    return { ...state, ...INITIAL_STATE };
  },
  [Types.GET_LINK_START]: (state) => {
    return {
      ...state,
      error: null,
      getLinkResponse: null
    };
  },
  [Types.GET_LINK]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: true,
      getLinkResponse: null
    };
  },
  [Types.GET_LINK_SUCCESS]: (state, action) => {
    const { forgotPassword: getLinkResponse } = action.data;
    return {
      ...state,
      error: null,
      isFetching: false,
      getLinkResponse
    };
  },
  [Types.GET_LINK_FAILURE]: (state, action) => {
    return {
      ...state,
      error: action.error,
      isFetching: false,
      getLinkResponse: null
    };
  },
  [Types.UPDATE_START]: (state, action) => {
    const { params: updateParams } = action.data;
    return {
      ...state,
      error: null,
      updated: false,
      updateParams
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
    const { updateForgottenPassword: updateResponse } = action.data;
    return {
      ...state,
      error: null,
      isFetching: false,
      updated: true,
      updateResponse
    };
  },
  [Types.UPDATE_FAILURE]: (state, action) => {
    return {
      ...state,
      error: action.error,
      isFetching: false,
      updated: false,
      updateResponse: null
    };
  },
  [Types.CHANGE_PASSWORD]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: true,
      updated: false
    };
  },
  [Types.CHANGE_PASSWORD_SUCCESS]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: false,
      updated: true
    };
  },
  [Types.CHANGE_PASSWORD_FAILURE]: (state, action) => {
    return {
      ...state,
      error: action.error,
      isFetching: false,
      updated: false
    };
  },
  [Types.RESET_UPDATE_PARAMS]: (state) => {
    return {
      ...state,
      error: null,
      updateParams: null
    };
  }
});
