import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
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
    addToFavorites: ['input'],
    addToFavoritesSuccess: null,
    addToFavoritesFailure: ['error'],

    removeFromFavorites: ['channelIds'],
    removeFromFavoritesSuccess: null,
    removeFromFavoritesFailure: ['error'],

    getFavorites: ['input'],
    getFavoritesSuccess: ['data'],
    getFavoritesFailure: ['error'],

    /// downloads
    updateDownloads: ['data'],
    updateDownloadsProgress: ['data'],

    searchStart: null,
    search: ['input'],
    searchSuccess: ['data'],
    searchFailure: ['error'],

    // misc
    reset: null,
    setPaginatorInfo: ['data'],
    resetPaginator: null
  },
  { prefix: '@Itv/' }
);

export { Types, Creators };
