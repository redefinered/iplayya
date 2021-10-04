import { REHYDRATE } from 'redux-persist';
import { createReducer, createActions } from 'reduxsauce';
import { createSelector } from 'reselect';

const { Types, Creators } = createActions(
  {
    appReady: null,
    appReadySuccess: null,
    appReadyFailure: ['error'],
    setNetworkInfo: ['networkInfo'],
    setHeaderHeight: ['height'],
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
  headerHeight: null,
  vodCategories: [],
  musicGenres: []
};

export default createReducer(INITIAL_STATE, {
  [REHYDRATE]: (state) => {
    return {
      ...state,
      isLoading: true
    };
  },
  [Types.SET_HEADER_HEIGHT]: (state, action) => {
    return { ...state, headerHeight: action.height };
  },
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

const appState = (state) => state.app;
const itvState = (state) => state.itv;
const imoviesState = (state) => state.movies;
const isportsState = (state) => state.sports;
const imusicState = (state) => state.music;

export const selectDataLoaded = createSelector(
  [itvState, imoviesState, isportsState, imusicState],
  (
    { genres: itvGenres },
    { categories: movieCategories },
    { genres: isportsGenres },
    { genres: imusicGenres }
  ) => {
    if (!itvGenres.length) return false;
    if (!movieCategories.length) return false;
    if (!isportsGenres.length) return false;
    if (!imusicGenres.length) return false;
    return true;
  }
);

export const selectIsLoading = createSelector([appState], ({ isLoading }) => isLoading);
export const selectNetworkInfo = createSelector([appState], ({ networkInfo }) => networkInfo);
export const selectHeaderHeight = createSelector([appState], ({ headerHeight }) => headerHeight);
export const selectIsConnected = createSelector([appState], ({ networkInfo }) => {
  if (!networkInfo) return false;

  return networkInfo.isConnected;
});
