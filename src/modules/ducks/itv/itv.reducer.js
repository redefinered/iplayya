import { createReducer } from 'reduxsauce';
import { Types } from './itv.actions';

const INITIAL_STATE = {
  isFetching: false,
  error: null,
  selectPaginatorInfo: {
    limit: 10,
    pageNumber: 1
  }
};

export default createReducer(INITIAL_STATE, {
  [Types.GET_CHANNELS]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  }
});
