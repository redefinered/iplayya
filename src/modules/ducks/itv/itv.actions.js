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
    getChannelsStart: null,
    getChannels: ['input'],
    getChannelsSuccess: ['channels', 'nextPaginatorInfo'],
    getChannelsFailure: ['error'],

    getProgramsByChannel: ['input'],
    getProgramsByChannelSuccess: ['data'],
    getProgramsByChannelFailure: ['error'],

    getChannelsByCategoriesStart: null,
    getChannelsByCategories: ['input'],
    getChannelsByCategoriesSuccess: ['channels', 'nextPaginatorInfo'],
    getChannelsByCategoriesFailure: ['error'],

    // add to favorites
    addToFavorites: ['videoId'],
    addToFavoritesSuccess: null,
    addToFavoritesFailure: ['error'],

    removeFromFavorites: ['channelIds'],
    removeFromFavoritesSuccess: null,
    removeFromFavoritesFailure: ['error'],

    getFavorites: ['input'],
    getFavoritesSuccess: ['data', 'nextPaginator'],
    getFavoritesFailure: ['error'],
    resetFavoritesPaginator: null,

    /// downloads
    updateDownloads: ['data'],
    updateDownloadsProgress: ['data'],

    searchStart: null,
    search: ['input', 'shouldIncrement'],
    searchSuccess: ['results', 'nextPaginatorInfo'],
    searchFailure: ['error'],
    resetSearchResultsPaginator: null,

    //recent search
    updateRecentSearch: ['term'],

    // misc
    reset: null,
    setPaginatorInfo: ['data'],
    resetPaginator: null
  },
  { prefix: '@Itv/' }
);

export { Types, Creators };
