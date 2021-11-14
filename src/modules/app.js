import { REHYDRATE } from 'redux-persist';
import { createReducer, createActions } from 'reduxsauce';
import { createSelector } from 'reselect';

const { Types, Creators } = createActions(
  {
    appReady: null,
    appReadySuccess: null,
    appReadyFailure: ['error'],

    setProvider: ['id'],
    setProviderSuccess: ['selectedProvider', 'contentBase'],
    setProviderFailure: ['error'],

    setNetworkInfo: ['networkInfo'],
    setHeaderHeight: ['height'],
    default: null,
    purgeStore: null
  },
  { prefix: '@App/' }
);

export { Types, Creators };

// default State
const INITIAL_STATE = {
  isLoading: true,
  error: null,
  networkInfo: null,
  headerHeight: null,
  vodCategories: [],
  activeProvider: null,
  contentBase: {
    itvGenres: [],
    movieCategories: [],
    isportsGenres: [],
    musicGenres: []
  }
};

export default createReducer(INITIAL_STATE, {
  [REHYDRATE]: (state) => {
    return {
      ...state,
      isLoading: true
    };
  },
  [Types.SET_PROVIDER]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: true
    };
  },
  [Types.SET_PROVIDER_SUCCESS]: (state, action) => {
    const { selectedProvider, contentBase } = action;
    const { itvGenres, movieCategories, isportsGenres, musicGenres } = contentBase;
    return {
      ...state,
      error: null,
      isFetching: false,
      activeProvider: selectedProvider,
      contentBase: { itvGenres, movieCategories, isportsGenres, musicGenres }
    };
  },
  [Types.SET_PROVIDER_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
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

export const selectIsLoading = createSelector([appState], ({ isLoading }) => isLoading);
export const selectNetworkInfo = createSelector([appState], ({ networkInfo }) => networkInfo);
export const selectHeaderHeight = createSelector([appState], ({ headerHeight }) => headerHeight);
export const selectIsConnected = createSelector([appState], ({ networkInfo }) => {
  if (!networkInfo) return false;

  return networkInfo.isConnected;
});

export const selectActiveProvider = createSelector(
  [appState],
  ({ activeProvider }) => activeProvider
);

export const selectItvGenres = createSelector(
  [appState],
  ({ contentBase: { itvGenres } }) => itvGenres
);

export const selectMovieCategories = createSelector(
  [appState],
  ({ contentBase: { movieCategories } }) => movieCategories
);

export const selectIsportsGenres = createSelector(
  [appState],
  ({ contentBase: { isportsGenres } }) => isportsGenres
);

export const selectMusicGenres = createSelector(
  [appState],
  ({ contentBase: { musicGenres } }) => musicGenres
);

export const selectCategoriesOf = (type) =>
  createSelector([selectMovieCategories], (categories) => {
    const collection = [];
    categories.map(({ id, title }) => {
      let category_alias = title.split(': ')[0];
      if (type === category_alias.toLowerCase()) {
        return collection.push({ id, title });
      }
    });

    return collection;
  });
