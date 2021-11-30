import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    start: null,

    /// query: GET_GENRES
    getGenres: null,
    getGenresSuccess: ['data'],
    getGenresFailure: ['error'],

    getChannel: ['input'],
    getChannelSuccess: ['channel', 'token'],
    getChannelFailure: ['error'],

    /// get channels
    getChannels: ['input'],
    getChannelsSuccess: ['channels', 'nextPaginatorInfo'],
    getChannelsFailure: ['error'],

    getProgramsByChannelStart: null,
    getProgramsByChannel: ['input'],
    getProgramsByChannelSuccess: ['data'],
    getProgramsByChannelFailure: ['error'],

    getChannelsByCategoriesStart: null,
    getChannelsByCategories: ['input'],
    getChannelsByCategoriesSuccess: ['channels', 'nextPaginatorInfo'],
    getChannelsByCategoriesFailure: ['error'],

    setIsSearching: ['isSearching'], /// is searching for favorites

    removeFromFavorites: ['channelIds'],
    removeFromFavoritesSuccess: null,
    removeFromFavoritesFailure: ['error'],

    getFavorites: ['input'],
    getFavoritesSuccess: ['favorites'],
    getFavoritesFailure: ['error'],
    resetFavoritesPaginator: null,

    /// downloads
    updateDownloads: ['data'],
    updateDownloadsProgress: ['data'],

    searchStart: null,
    search: ['input'],
    searchSuccess: ['results'],
    searchFailure: ['error'],
    resetSearchResultsPaginator: null,

    //recent search
    updateRecentSearch: ['channel'],
    clearRecentSearch: null,

    /**
     * status:
     * 0 - inactive
     * 1 - active
     */
    subscribeToProgram: ['status', 'programId'],

    createNotification: ['notification'], /// an object
    activateSubscription: ['subscriptionId'],
    deactivateSubscription: ['subscriptionId'],
    setNotificationToRead: ['notificationId'],
    deleteNotification: ['notificationId'],

    /// set deactivateNotification state to null
    clearActivateKey: null,
    clearDeactivateKey: null,
    cancelNotification: ['notificationId'],

    onRegister: ['token'],
    onNotif: ['notification'],

    // misc
    reset: null,
    setPaginatorInfo: ['data'],
    resetPaginator: null
  },
  { prefix: '@Itv/' }
);

export { Types, Creators };
