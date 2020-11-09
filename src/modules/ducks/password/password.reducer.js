import { createReducer } from 'reduxsauce';
import { Types } from './password.actions';

const INITIAL_STATE = {
  error: null,
  isFetching: false,
  updateParams: null,
  updated: null,
  updateResponse: null,
  getLinkResponse: null
};

export default createReducer(INITIAL_STATE, {
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
      updated: null,
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
  [Types.RESET_UPDATE_PARAMS]: (state) => {
    return {
      ...state,
      error: null,
      updateParams: null
    };
  }
});
