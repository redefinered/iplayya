import { createReducer } from 'reduxsauce';
import { Types } from './itv.actions';
import uniqBy from 'lodash/unionBy';
import orderBy from 'lodash/orderBy';
import {
  updateChannelsWithFavorited,
  // activateSubscriptionById,
  deactivateSubscriptionById,
  setNotificationToReadById
} from './itv.helpers';

const INITIAL_STATE = {
  isFetching: false,
  error: null,
  genres: [],
  recentSearch: [],

  paginator: {
    limit: 10,
    pageNumber: 1,
    orderBy: 'number',
    order: 'asc'
  },

  // random channels from getChannelsByCategory
  featuredChannels: [],

  channel: null,
  /// channels per category
  // changes depending on user click in itv screen
  channels: [],

  // programs per selected channel
  programs: [],

  // addedToFavorites: false,
  // removedFromFavorites: false,

  favorites: [],
  favoritesPaginator: {
    limit: 10,
    pageNumber: 1,
    orderBy: 'number',
    order: 'asc'
  },
  favoritesListUpdated: false,

  // download tasks
  downloads: {},

  // downloads progress
  downloadsProgress: {},

  // data for downloaded movies where we get properties like title, id, etc...
  downloadsData: [],

  searchResults: [],
  searchResultsPaginator: {
    limit: 10,
    pageNumber: 1,
    orderBy: 'number',
    order: 'asc'
  },

  subscriptions: [], // program schedule subscriptions
  notifications: [], // notifications delivered

  /**
   * value is either a string which is the ID of a program or null
   * used for cancelling a created push notification
   * should always be set to null after cancelling the scheduled notification
   */
  activateNotification: null,
  deactivateNotification: null
};

export default createReducer(INITIAL_STATE, {
  [Types.START]: (state) => {
    return { ...state, channel: null };
  },
  [Types.ON_NOTIF]: (state, action) => {
    return {
      ...state,
      notifications: [
        Object.assign(action.notification, {
          read: false,
          createdAt: new Date(Date.now).getTime()
        }),
        ...state.notifications
      ]
    };
  },
  [Types.SET_NOTIFICATION_TO_READ]: (state, action) => {
    const notifications = setNotificationToReadById(state, action);

    return { ...state, notifications };
  },
  [Types.CANCEL_NOTIFICATION]: (state, action) => {
    return { ...state, deactivateNotification: action.notificationId };
  },
  [Types.CLEAR_DEACTIVATE_KEY]: (state) => {
    return { ...state, deactivateNotification: null };
  },
  [Types.SUBSCRIBE_TO_PROGRAM]: (state, action) => {
    const { status, programId } = action;
    return { ...state, subscriptions: [{ status, id: programId }, ...state.subscriptions] };
  },
  [Types.CREATE_NOTIFICATION]: (state, action) => {
    /// always add the newest at the first position
    // because that will be the next notification that will be created
    return { ...state, notifications: [action.notification, ...state.notifications] };
  },
  // [Types.ACTIVATE_SUBSCRIPTION]: (state, action) => {
  //   const notifications = activateSubscriptionById(state, action);

  //   return { ...state, notifications };
  // },
  [Types.DEACTIVATE_SUBSCRIPTION]: (state, action) => {
    const subscriptions = deactivateSubscriptionById(state, action);

    return { ...state, subscriptions };
  },
  [Types.DELETE_NOTIFICATION]: (state, action) => {
    const updatedNotifs = state.notifications.filter(({ id }) => id !== action.notificationId);
    return { ...state, notifications: updatedNotifs };
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
      genres: action.data
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
      error: null
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

  /// TODO: add GET_PROGRAMS_BY_CHANNEL reducers
  [Types.GET_CHANNELS_START]: (state) => {
    return {
      ...state,
      channels: []
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
      // addedToFavorites: false,
      // removedFromFavorites: false
    };
  },
  [Types.GET_CHANNELS_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
    };
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
      paginator: Object.assign(state.paginator, nextPaginatorInfo)
      // addedToFavorites: false
      // removedFromFavorites: false
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

  // add to favorites
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
      isFetching: false,
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

  // add to favorites
  [Types.REMOVE_FROM_FAVORITES]: (state) => {
    return {
      ...state,
      isFetching: true,
      error: null,
      favoritesListUpdated: false
    };
  },
  [Types.REMOVE_FROM_FAVORITES_SUCCESS]: (state) => {
    return {
      ...state,
      isFetching: false,
      error: null,
      favorites: [],
      favoritesListUpdated: true
    };
  },
  [Types.REMOVE_FROM_FAVORITES_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error,
      favoritesListUpdated: false
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
    const { data, nextPaginator } = action;

    const updatedData = uniqBy([...state.favorites, ...data], 'id');

    return {
      ...state,
      isFetching: false,
      error: null,
      // addedToFavorites: false,
      // removedFromFavorites: false,
      favorites: orderBy(updatedData, 'number', 'asc'), /// overkill yata to
      favoritesPaginator: nextPaginator
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
        limit: 10,
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
        limit: 10,
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
    const { results, nextPaginatorInfo } = action;

    const updatedSearchResults = uniqBy([...results, ...state.searchResults], 'id');

    // console.log({ loc: 'reducer', ...nextPaginatorInfo });

    return {
      ...state,
      isFetching: false,
      searchResults: orderBy(updatedSearchResults, 'number', 'asc'),
      searchResultsPaginator: { orderBy: 'number', order: 'asc', ...nextPaginatorInfo }
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
    let newRecentSearch = [];
    if (state.recentSearch.findIndex((x) => x === action.term) >= 0) {
      newRecentSearch = state.recentSearch;
    } else {
      newRecentSearch = [action.term, ...state.recentSearch];
    }
    return {
      ...state,
      recentSearch: newRecentSearch.splice(0, 10)
    };
  },
  [Types.RESET_SEARCH_RESULTS_PAGINATOR]: (state) => {
    return {
      ...state,
      searchResultsPaginator: {
        limit: 10,
        pageNumber: 1,
        orderBy: 'number',
        order: 'asc'
      }
    };
  },

  [Types.RESET]: (state) => {
    return { ...state, ...INITIAL_STATE };
  }
});
