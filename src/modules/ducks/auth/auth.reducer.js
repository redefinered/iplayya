import { createReducer } from 'reduxsauce';
import { Types } from './auth.actions';

const INITIAL_STATE = {
  error: null,
  isFetching: false,
  isLoggedIn: false,
  signedUp: false,
  pwResetLinkMessage: null,
  resetPasswordParams: null,
  updatingPassword: false,
  passwordUpdated: false,
  resetMessage: null // will define if password is updated
};

export default createReducer(INITIAL_STATE, {
  [Types.REGISTER_START]: (state) => {
    return {
      ...state,
      ...INITIAL_STATE
    };
  },
  [Types.REGISTER]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: true
    };
  },
  [Types.REGISTER_SUCCESS]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: false,
      signedUp: true
    };
  },
  [Types.REGISTER_FAILURE]: (state, action) => {
    return {
      ...state,
      error: action.error,
      isFetching: false,
      signedUp: false
    };
  },
  [Types.SIGN_IN]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: true,
      signedUp: false
    };
  },
  [Types.SIGN_IN_SUCCESS]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: false,
      isLoggedIn: true
    };
  },
  [Types.SIGN_IN_FAILURE]: (state, action) => {
    return {
      ...state,
      error: action.error,
      isFetching: false,
      isLoggedIn: false
    };
  },
  [Types.SIGN_OUT]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: true
    };
  },
  [Types.SIGN_OUT_SUCCESS]: (state) => {
    return {
      ...state,
      isFetching: false,
      isLoggedIn: false
    };
  },
  [Types.SIGN_OUT_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
    };
  },
  [Types.PURGE_STORE]: (state) => {
    return {
      ...state,
      ...INITIAL_STATE
    };
  }
});
