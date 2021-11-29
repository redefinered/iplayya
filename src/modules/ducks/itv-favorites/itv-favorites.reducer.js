import { createReducer } from 'reduxsauce';
import { Types } from './itv-favorites.actions';
import uniqBy from 'lodash/unionBy';
import orderBy from 'lodash/orderBy';
import { updateChannelsWithFavorited } from './itv.helpers';
import { PAGINATOR_LIMIT } from 'common/globals';

const INITIAL_STATE = {
  error: null,
  isFetching: false,
  updated: false
};

export default createReducer(INITIAL_STATE, {
  [Types.START]: (state) => ({ ...state, error: null, isFetching: false, updated: false }),

  [Types.ADD_TO_FAVORITES]: (state, action) => {
    const channels = updateChannelsWithFavorited(state, action);

    return {
      ...state,
      isFetching: true,
      error: null,
      channels,
      favoritesListUpdated: false
    };
  },
  [Types.ADD_TO_FAVORITES_SUCCESS]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null,
      favoritesListUpdated: true
    };
  },
  [Types.ADD_TO_FAVORITES_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error,
      favoritesListUpdated: false
    };
  },

  [Types.REMOVE_FROM_FAVORITES]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null,
      favoritesListRemoveUpdated: false
    };
  },
  [Types.REMOVE_FROM_FAVORITES_SUCCESS]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null,
      channels: [],
      favoritesListRemoveUpdated: true
    };
  },
  [Types.REMOVE_FROM_FAVORITES_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error,
      favoritesListRemoveUpdated: false
    };
  },

  /// get favorites
  [Types.GET_FAVORITES]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_FAVORITES_SUCCESS]: (state, action) => {
    const { favorites } = action;
    const { favoritesPaginator } = state;

    const updatedData = uniqBy(favorites, 'id');

    return {
      ...state,
      isFetching: false,
      error: null,
      favoritesListUpdated: false,
      favorites: orderBy(updatedData, 'number', 'asc'), /// overkill yata to
      favoritesPaginator: Object.assign(favoritesPaginator, {
        pageNumber: favoritesPaginator.pageNumber + 1
      })
    };
  },
  [Types.GET_FAVORITES_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
    };
  },
  [Types.RESET_FAVORITES_PAGINATOR]: (state) => {
    return {
      ...state,
      favoritesPaginator: {
        limit: PAGINATOR_LIMIT,
        pageNumber: 1,
        orderBy: 'number',
        order: 'asc'
      }
    };
  }
});
