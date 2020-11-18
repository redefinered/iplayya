import { createReducer } from 'reduxsauce';
import { Types } from './provider.actions';

const INITIAL_STATE = {
  error: null,
  isFetching: false,
  created: null,
  createdId: null
};

export default createReducer(INITIAL_STATE, {
  [Types.CREATE_START]: (state) => {
    return {
      ...state,
      created: null,
      createdId: null
    };
  },
  [Types.CREATE]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: true
    };
  },
  [Types.CREATE_SUCCESS]: (state, action) => {
    const {
      createUserProvider: { id }
    } = action.data;
    return {
      ...state,
      error: null,
      isFetching: false,
      created: true,
      createdId: id
    };
  },
  [Types.CREATE_FAILURE]: (state, action) => {
    return {
      ...state,
      error: action.error,
      isFetching: false,
      created: false,
      createdId: null
    };
  },
  [Types.DELETE_START]: (state) => {
    return {
      ...state,
      deleted: null
    };
  },
  [Types.DELETE]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: true
    };
  },
  [Types.DELETE_SUCCESS]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: false,
      deleted: true
    };
  },
  [Types.DELETE_FAILURE]: (state, action) => {
    return {
      ...state,
      error: action.error,
      isFetching: false,
      deleted: false
    };
  }
});
