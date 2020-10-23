import { createReducer } from 'reduxsauce';
import { Types } from './nav.actions';

const INITIAL_STATE = {
  hideTabs: false
};

export default createReducer(INITIAL_STATE, {
  [Types.SET_BOTTOM_TABS_VISIBLE]: (state, action) => {
    const { hideTabs } = action.data;
    return {
      ...state,
      hideTabs
    };
  }
});
