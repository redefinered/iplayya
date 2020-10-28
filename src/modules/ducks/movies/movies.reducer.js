import { createReducer } from 'reduxsauce';
import { Types } from './movies.actions';

const INITIAL_STATE = {
  isFetching: false,
  error: null
};

export default createReducer(INITIAL_STATE, {
  [Types.GET_MOVIES]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  }
});
