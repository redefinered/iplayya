import { createReducer } from 'reduxsauce';
import { Types } from './profile.actions';

const INITIAL_STATE = {
  error: null,
  isFetching: false,
  currentUser: null
};

export default createReducer(INITIAL_STATE, {
  [Types.GET_PROFILE]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: true
    };
  },
  [Types.GET_PROFILE_SUCCESS]: (state, action) => {
    const { currentUser } = action.data;
    return {
      ...state,
      error: null,
      isFetching: false,
      currentUser
    };
  },
  [Types.GET_PROFILE_FAILURE]: (state, action) => {
    return {
      ...state,
      error: action.error,
      isFetching: false,
      currentUser: null
    };
  },
  [Types.REMOVE_CURRENT_USER]: (state) => {
    return { ...state, currentUser: null };
  }
});
