import { createReducer, createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    appReady: null,
    appReadySuccess: null,
    appReadyFailure: ['error'],
    setNetworkInfo: ['networkInfo'],
    default: null,
    purgeStore: null
  },
  { prefix: '@App/' }
);

export { Creators };

// default State
const INITIAL_STATE = {
  isLoading: true,
  error: null,
  networkInfo: null,
  vodCategories: [],
  musicGenres: []
};

export default createReducer(INITIAL_STATE, {
  [Types.APP_READY]: (state) => {
    return {
      ...state,
      isLoading: true
    };
  },
  [Types.APP_READY_SUCCESS]: (state) => {
    return {
      ...state,
      isLoading: false
    };
  },
  [Types.APP_READY_FAILURE]: (state, action) => {
    return {
      ...state,
      error: action.error,
      isLoading: false
    };
  },
  [Types.SET_NETWORK_INFO]: (state, action) => {
    return {
      ...state,
      networkInfo: action.networkInfo
    };
  },
  [Types.DEFAULT]: () => {
    return {
      ...INITIAL_STATE,
      isLoading: false
    };
  }
});
