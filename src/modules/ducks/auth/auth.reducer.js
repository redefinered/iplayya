import { createReducer } from 'reduxsauce';
import { Types } from './auth.actions';

const INITIAL_STATE = {
  error: null,
  isFetching: false,
  currentUser: null,
  portalAddress: null
};

export default createReducer(INITIAL_STATE, {
  [Types.HELLO]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: true
    };
  },
  [Types.HELLO_SUCCESS]: (state, action) => {
    const { name } = action.data;
    return {
      ...state,
      error: null,
      isFetching: false,
      name
    };
  },
  [Types.HELLO_FAILURE]: (state, action) => {
    return {
      ...state,
      error: action.error,
      isFetching: false,
      name: null
    };
  },
  [Types.SET_PORTAL_ADDRESS]: (state, action) => {
    const { portalAddress } = action.data;
    return {
      ...state,
      portalAddress
    };
  },
  [Types.PURGE_STORE]: (state) => {
    return {
      ...state
    };
  }
});
