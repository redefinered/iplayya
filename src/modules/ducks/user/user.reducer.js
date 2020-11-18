import { createReducer } from 'reduxsauce';
import { Types } from './user.actions';

const INITIAL_STATE = {
  error: null,
  isFetching: false,
  currentUser: null,
  skippedProviderAdd: false,
  completedOnboarding: false
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
  }
});
