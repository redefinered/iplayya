import { createReducer } from 'reduxsauce';
import { Types } from './user.actions';

const INITIAL_STATE = {
  error: null,
  isFetching: false,
  skippedProviderAdd: false,
  // completedOnboarding: false,
  updated: null,

  // selected provider where all content will come from
  provider: null
};

export default createReducer(INITIAL_STATE, {
  // [Types.RESET]: (state) => {
  //   return {
  //     ...state,
  //     error: null,
  //     isFetching: false,
  //     skippedProviderAdd: false,
  //     completedOnboarding: false,
  //     updated: null
  //   };
  // },
  [Types.SET_PROVIDER]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: true
    };
  },
  [Types.SET_PROVIDER_SUCCESS]: (state, action) => {
    const { id: provider } = action;
    return {
      ...state,
      error: null,
      isFetching: false,
      provider
    };
  },
  [Types.SET_PROVIDER_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
    };
  },
  [Types.SKIP_PROVIDER_ADD]: (state) => {
    return { ...state, skippedProviderAdd: true };
  },
  [Types.UPDATE_PLAYBACK_SETTINGS_START]: (state) => {
    return {
      ...state,
      error: null,
      updated: null
    };
  },
  [Types.UPDATE_PLAYBACK_SETTINGS]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: true
    };
  },
  [Types.UPDATE_PLAYBACK_SETTINGS_SUCCESS]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: false,
      updated: true
    };
  },
  [Types.UPDATE_PLAYBACK_SETTINGS_FAILURE]: (state, action) => {
    return {
      ...state,
      error: action.error,
      isFetching: false,
      updated: false
    };
  }
  // [Types.HIDE_WELCOME_DIALOG]: (state) => {
  //   return {
  //     ...state,
  //     completedOnboarding: true
  //   };
  // }
});
