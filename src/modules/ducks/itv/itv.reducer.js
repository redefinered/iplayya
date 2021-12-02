import { createReducer } from 'reduxsauce';
import { Types } from './itv.actions';
import uniqBy from 'lodash/unionBy';
import orderBy from 'lodash/orderBy';
import { PAGINATOR_LIMIT, ITV_SEARCH_RESULTS_LIMIT } from 'common/globals';

const INITIAL_STATE = {
  isFetching: false,
  error: null,
  genres: [],
  recentSearch: [],

  paginator: {
    limit: PAGINATOR_LIMIT,
    pageNumber: 1,
    orderBy: 'number',
    order: 'asc'
  },

  channel: null,
  /// channels per category
  // changes depending on user click in itv screen
  channels: [],

  featuredChannels: [],

  // programs per selected channel
  programs: [],

  favorites: [],
  favoritesPaginator: {
    limit: PAGINATOR_LIMIT,
    pageNumber: 1,
    orderBy: 'number',
    order: 'asc'
  },
  favoritesListUpdated: false,
  favoritesListRemoveUpdated: false,

  isSearching: false,
  searchResults: [],
  searchResultsPaginator: {
    limit: ITV_SEARCH_RESULTS_LIMIT,
    pageNumber: 1,
    orderBy: 'number',
    order: 'asc'
  }
};

export default createReducer(INITIAL_STATE, {
  [Types.START]: (state) => {
    return { ...state, channel: null };
  },
  [Types.GET_GENRES]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_GENRES_SUCCESS]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: null,
      genres: orderBy(action.data, 'number', 'asc')
    };
  },
  [Types.GET_GENRES_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
    };
  },
  [Types.GET_CHANNEL]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null,
      programs: []
    };
  },
  [Types.GET_CHANNEL_SUCCESS]: (state, action) => {
    const { channel, token } = action;
    return {
      ...state,
      isFetching: false,
      error: null,
      channel: { token, ...channel }
    };
  },
  [Types.GET_CHANNEL_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
    };
  },

  [Types.GET_CHANNELS]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_CHANNELS_SUCCESS]: (state, action) => {
    const { channels, nextPaginatorInfo } = action;

    let updatedChannels = uniqBy([...channels, ...state.channels], 'id');

    /// convert number property to Int for orderBy function to work
    updatedChannels = updatedChannels.map(({ number, ...rest }) => {
      return { number: parseInt(number), ...rest };
    });

    return {
      ...state,
      isFetching: false,
      error: null,
      channels: orderBy(updatedChannels, 'number', 'asc'),
      paginator: Object.assign(state.paginator, nextPaginatorInfo)
    };
  },
  [Types.GET_CHANNELS_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
    };
  },

  [Types.SET_FEATURED_CHANNELS]: (state, action) => {
    return { ...state, featuredChannels: action.channels };
  },

  [Types.GET_CHANNELS_BY_CATEGORIES_START]: (state) => {
    return {
      ...state,
      channels: []
    };
  },
  [Types.GET_CHANNELS_BY_CATEGORIES]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_CHANNELS_BY_CATEGORIES_SUCCESS]: (state, action) => {
    const { channels, nextPaginatorInfo } = action;

    const updatedChannels = uniqBy([...channels, ...state.channels], 'id');

    return {
      ...state,
      isFetching: false,
      error: null,
      channels: orderBy(updatedChannels, 'number', 'asc'),
      paginator: Object.assign(state.paginator, nextPaginatorInfo),
      favoritesListUpdated: false,
      favoritesListRemoveUpdated: false
    };
  },
  [Types.GET_CHANNELS_BY_CATEGORIES_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
    };
  },

  // get programs by channel
  [Types.GET_PROGRAMS_BY_CHANNEL_START]: (state) => {
    return {
      ...state,
      programs: [],
      error: null
    };
  },
  [Types.GET_PROGRAMS_BY_CHANNEL]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.GET_PROGRAMS_BY_CHANNEL_SUCCESS]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: null,
      programs: action.data
    };
  },
  [Types.GET_PROGRAMS_BY_CHANNEL_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error,
      programs: []
    };
  },
  [Types.SET_IS_SEARCHING]: (state, action) => ({ ...state, isSearching: action.isSearching }), /// is searching for favorites

  // add to favorites
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

    // const updatedData = uniqBy([...state.favorites, ...data], 'id');
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
  },

  /// downloads
  [Types.UPDATE_DOWNLOADS]: (state, action) => {
    return {
      ...state,
      downloads: action.data
    };
  },
  [Types.UPDATE_DOWNLOADS_PROGRESS]: (state, action) => {
    const { id, ...progress } = action.data;
    const current = state.downloadsProgress;
    current[id] = { id, ...progress };
    return {
      ...state,
      downloadsProgress: current
    };
  },

  // misc
  [Types.SET_PAGINATOR_INFO]: (state, action) => {
    return {
      ...state,
      paginator: action.data
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

  /// search
  [Types.SEARCH_START]: (state) => {
    return {
      ...state,
      isFetching: false,
      error: null,
      searchResults: []
    };
  },
  [Types.SEARCH]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null
    };
  },
  [Types.SEARCH_SUCCESS]: (state, action) => {
    const { results } = action;
    const { searchResultsPaginator } = state;

    const updatedSearchResults = uniqBy([...results, ...state.searchResults], 'id');

    // console.log({ loc: 'reducer', ...nextPaginatorInfo });

    return {
      ...state,
      isFetching: false,
      searchResults: orderBy(updatedSearchResults, 'number', 'asc'),

      /// takes current searchResultPaginator and increment it's pageNumber property
      searchResultsPaginator: Object.assign(searchResultsPaginator, {
        pageNumber: searchResultsPaginator.pageNumber + 1
      })
    };
  },
  [Types.SEARCH_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
    };
  },
  [Types.UPDATE_RECENT_SEARCH]: (state, action) => {
    const { channel } = action;

    const x = state.recentSearch.find(({ id }) => id === channel.id);

    if (typeof x !== 'undefined') {
      /// channel is already added
      return { ...state };
    }

    return { ...state, recentSearch: [channel, ...state.recentSearch] };
    // let newRecentSearch = [];
    // if (state.recentSearch.findIndex((x) => x === action.term) >= 0) {
    //   newRecentSearch = state.recentSearch;
    // } else {
    //   newRecentSearch = [action.term, ...state.recentSearch];
    // }
    // return {
    //   ...state,
    //   recentSearch: newRecentSearch.splice(0, 10)
    // };
  },

  [Types.CLEAR_RECENT_SEARCH]: (state) => ({ ...state, recentSearch: [] }),
  [Types.RESET_SEARCH_RESULTS_PAGINATOR]: (state) => {
    return {
      ...state,
      searchResultsPaginator: {
        limit: ITV_SEARCH_RESULTS_LIMIT,
        pageNumber: 1,
        orderBy: 'number',
        order: 'asc'
      }
    };
  }
});
