import { createReducer } from 'reduxsauce';
import { Types } from './password.actions';

const INITIAL_STATE = {
  error: null,
  isFething: false,
  updateParams: null,
  updated: false
};

export default createReducer(INITIAL_STATE, {
  [Types.GET_LINK_START]: (state) => {
    return {
      ...state,
      pwResetLinkMessage: null,
      passwordUpdated: false,
      updatingPassword: true
    };
  },
  [Types.GET_LINK]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: true
    };
  },
  [Types.GET_LINK_SUCCESS]: (state, action) => {
    const { pwResetLinkMessage } = action.data;
    return {
      ...state,
      error: null,
      isFetching: false,
      pwResetLinkMessage
    };
  },
  [Types.GET_LINK_FAILURE]: (state, action) => {
    return {
      ...state,
      error: action.error,
      isFetching: false,
      pwResetLinkMessage: null
    };
  },
  [Types.CLEAR_UPDATE_PARAMS]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: false,
      resetPasswordParams: null
    };
  },
  [Types.UPDATE_START]: (state, action) => {
    const { params } = action.data;
    return {
      ...state,
      resetMessage: null,
      resetPasswordParams: params,
      updatingPassword: true
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
    const { updateForgottenPassword: resetMessage } = action.data;
    return {
      ...state,
      error: null,
      isFetching: false,
      passwordUpdated: true,
      updatingPassword: false,
      resetMessage
    };
  },
  [Types.UPDATE_FAILURE]: (state, action) => {
    return {
      ...state,
      error: action.error,
      isFetching: false,
      passwordUpdated: false,
      resetMessage: null,
      updatingPassword: true
    };
  }
});
