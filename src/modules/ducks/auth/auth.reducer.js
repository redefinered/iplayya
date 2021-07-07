import { createReducer } from 'reduxsauce';
import { Types } from './auth.actions';

const INITIAL_STATE = {
  error: null,
  isFetching: false,
  isLoggedIn: false,
  networkInfo: null,
  currentUser: null,
  onboardingComplete: false
};

export default createReducer(INITIAL_STATE, {
  [Types.SET_ONBOARDING_COMPLETE]: (state) => {
    return { ...state, onboardingComplete: true };
  },
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
  // [Types.REGISTER_SUCCESS]: (state) => {
  //   return {
  //     ...state,
  //     error: null,
  //     isFetching: false,
  //     signedUp: true
  //   };
  // },
  [Types.REGISTER_FAILURE]: (state, action) => {
    return {
      ...state,
      error: action.error,
      isFetching: false
    };
  },
  [Types.SIGN_IN_START]: (state) => {
    return {
      ...state,
      isFetching: false,
      error: null,
      isLoggedIn: false
    };
  },
  [Types.SIGN_IN]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: true
    };
  },
  [Types.SIGN_IN_SUCCESS]: (state, action) => {
    return {
      ...state,
      error: null,
      isFetching: false,
      isLoggedIn: true,
      currentUser: action.user
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
  [Types.RESET]: (state) => {
    const { currentUser, onboardingComplete } = state;
    return {
      ...state,
      ...INITIAL_STATE,
      currentUser,
      onboardingComplete
    };
  }
});
