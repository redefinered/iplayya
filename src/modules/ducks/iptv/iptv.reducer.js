import { createReducer } from 'reduxsauce';
import { Types } from './iptv.actions';

const INITIAL_STATE = {
  error: null,
  isFetching: false,
  providers: []
};

export default createReducer(INITIAL_STATE, {
  [Types.ADD_PROVIDER]: (state, action) => {
    const { provider } = action.data;
    const { providers } = state;
    providers.push(provider);
    return {
      ...state,
      providers
    };
  }
});
