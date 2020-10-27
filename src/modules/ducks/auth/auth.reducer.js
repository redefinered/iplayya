import { createReducer } from 'reduxsauce';
import { Types } from './auth.actions';

const INITIAL_STATE = {
  error: null,
  isFetching: false,
  currentUser: null,
  isLoggedIn: false
};

export default createReducer(INITIAL_STATE, {
  [Types.SIGN_IN]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: true
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
  [Types.GET_PROFILE]: (state) => {
    return {
      ...state
    };
  },
  [Types.GET_PROFILE_SUCCESS]: (state, action) => {
    const { currentUser } = action.data;
    return {
      ...state,
      isLoggedIn: false,
      currentUser
    };
  },
  [Types.GET_PROFILE_FAILURE]: (state, action) => {
    return {
      ...state,
      isLoggedIn: false,
      error: action.error,
      currentUser: null
    };
  },
  [Types.SIGN_OUT]: (state) => {
    return {
      ...state,
      currentUser: null
    };
  },
  [Types.SIGN_OUT_SUCCESS]: (state) => {
    return {
      ...state,
      isLoggedIn: false
    };
  },
  [Types.SIGN_OUT_FAILURE]: (state, action) => {
    return {
      ...state,
      isLoggedIn: false,
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
