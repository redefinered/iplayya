import { createReducer } from 'reduxsauce';
import { Types } from './iradio-favorites.actions';
// import { filterOutRemovedItems } from './iradio-favorites.helpers';
import uniqBy from 'lodash/unionBy';
import orderBy from 'lodash/orderBy';
import { PAGINATOR_LIMIT } from 'common/globals';

const INITIAL_STATE = {
  isFetching: false,
  error: null,
  favorites: [],
  // addedToFavorites: [],
  added: false,
  removed: false,
  paginator: {
    limit: PAGINATOR_LIMIT,
    pageNumber: 1,
    orderBy: 'number',
    order: 'asc'
  }
};

export default createReducer(INITIAL_STATE, {
  [Types.START]: (state) => {
    return {
      ...state,
      added: false,
      removed: false,
      favorites: [],
      paginator: {
        limit: PAGINATOR_LIMIT,
        pageNumber: 1,
        orderBy: 'number',
        order: 'asc'
      }
    };
  },
  [Types.GET_FAVORITES]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_FAVORITES_SUCCESS]: (state, action) => {
    const { favorites } = action;
    const { paginator } = state;

    const updatedData = uniqBy(favorites, 'id');

    return {
      ...state,
      isFetching: false,
      error: null,
      favorites: orderBy(updatedData, 'number', 'asc'),
      // paginator: nextPaginator
      paginator: Object.assign(paginator, {
        pageNumber: paginator.pageNumber + 1
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
  [Types.ADD_TO_FAVORITES]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null,
      added: false
    };
  },
  [Types.ADD_TO_FAVORITES_SUCCESS]: (state) => {
    // const updated = updateAddedToFavorites(state, action);
    return {
      ...state,
      isFetching: false,
      error: null,
      added: true
      // addedToFavorites: updated
    };
  },
  [Types.ADD_TO_FAVORITES_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error,
      added: false
    };
  },
  [Types.REMOVE_FROM_FAVORITES]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null,
      removed: false
    };
  },
  [Types.REMOVE_FROM_FAVORITES_SUCCESS]: (state) => {
    // const favorites = filterOutRemovedItems(state, action);
    return {
      ...state,
      isFetching: false,
      error: null,
      removed: true
      // favorites
    };
  },
  [Types.REMOVE_FROM_FAVORITES_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error,
      removed: false
    };
  },
  [Types.RESET_PAGINATOR]: (state) => {
    return {
      ...state,
      paginator: {
        limit: PAGINATOR_LIMIT,
        pageNumber: 1,
        orderBy: 'number',
        order: 'asc'
      }
    };
  },
  [Types.RESET_UPDATE_INDICATORS]: (state) => {
    return { ...state, added: false, removed: false };
  }
});
