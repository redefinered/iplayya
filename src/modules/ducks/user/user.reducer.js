import { createReducer } from 'reduxsauce';
import { Types } from './user.actions';

const INITIAL_STATE = {
  error: null,
  isFetching: false,
  currentUser: null,
  skippedProviderAdd: false,
  completedOnboarding: false,
  updated: null
};

export default createReducer(INITIAL_STATE, {
  [Types.SET_CURRENT_USER]: (state, action) => {
    const { user: currentUser } = action.data;
    return {
      ...state,
      currentUser
    };
  },
  [Types.REMOVE_CURRENT_USER]: (state) => {
    return {
      ...state,
      currentUser: null
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
  },
  [Types.HIDE_WELCOME_DIALOG]: (state) => {
    return {
      ...state,
      completedOnboarding: true
    };
  }
});
