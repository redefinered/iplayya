import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    /// query: GET_GENRES
    getGenres: [],
    getGenresSuccess: ['data'],
    getGenresFailure: ['error'],

    getChannel: ['input'],
    getChannelSuccess: ['data'],
    getChannelFailure: ['error'],

    /// get channels
    getChannels: ['input'],
    getChannelsSuccess: ['data'],
    getChannelsFailure: ['error'],

    getProgramsByChannel: ['input'],
    getProgramsByChannelSuccess: ['data'],
    getProgramsByChannelFailure: ['error'],

    getChannelsByCategories: ['input'],
    getChannelsByCategoriesSuccess: ['data'],
    getChannelsByCategoriesFailure: ['error'],

    // add to favorites
    addToFavorites: ['input'],
    addToFavoritesSuccess: [],
    addToFavoritesFailure: ['error'],

    removeFromFavorites: ['channelIds'],
    removeFromFavoritesSuccess: [],
    removeFromFavoritesFailure: ['error'],

    getFavorites: ['input'],
    getFavoritesSuccess: ['data'],
    getFavoritesFailure: ['error'],

    // misc
    reset: [],
    setPaginatorInfo: ['data'],
    resetPaginator: [],

    /// downloads
    updateDownloads: ['data'],
    updateDownloadsProgress: ['data'],

    searchStart: [],
    search: ['input'],
    searchSuccess: ['data'],
    searchFailure: ['error']
  },
  { prefix: '@Itv/' }
);

export { Types, Creators };
