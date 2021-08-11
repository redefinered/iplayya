import { createReducer } from 'reduxsauce';
import { Types } from './auth.actions';
// import { Types as ProfileTypes } from 'modules/ducks/profile/profile.actions';
import { Types as ProviderTypes } from 'modules/ducks/provider/provider.actions';
import { checkIfIsInitialSignIn } from './auth.utils';

const INITIAL_STATE = {
  error: null,
  isFetching: false,
  isLoggedIn: false,
  networkInfo: null,
  currentUser: null,
  onboardingComplete: false,
  isInitialSignIn: null,
  isUsernameValid: null
};

export default createReducer(INITIAL_STATE, {
  // [ProfileTypes.UPDATE_SUCCESS]: (state) => {
  //   return { ...state, isInitialSignIn: false };
  // },
  [ProviderTypes.CREATE_SUCCESS]: (state) => {
    return { ...state, isInitialSignIn: false };
  },
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
      // onboardingComplete: true
    };
  },
  [Types.SIGN_IN_SUCCESS]: (state, action) => {
    const { isInitialSignIn } = action;

    const isInitSignIn = checkIfIsInitialSignIn(isInitialSignIn);

    return {
      ...state,
      error: null,
      isFetching: false,
      isLoggedIn: true,
      currentUser: action.user,
      isInitialSignIn: isInitSignIn
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
  [Types.VALIDATE_USERNAME]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: true
    };
  },
  [Types.VALIDATE_USERNAME_SUCCESS]: (state) => {
    return {
      ...state,
      isFetching: false,
      isUsernameValid: true
    };
  },
  [Types.VALIDATE_USERNAME_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error,
      isUsernameValid: false
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
