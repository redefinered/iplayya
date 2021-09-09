import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    start: null,

    /// query: GET_GENRES
    getGenres: [],
    getGenresSuccess: ['data'],
    getGenresFailure: ['error'],

    getChannel: ['input'],
    getChannelSuccess: ['channel', 'token'],
    getChannelFailure: ['error'],

    /// get channels
    getChannelsStart: null,
    getChannels: ['input'],
    getChannelsSuccess: ['data'],
    getChannelsFailure: ['error'],

    getProgramsByChannelStart: null,
    getProgramsByChannel: ['input'],
    getProgramsByChannelSuccess: ['data'],
    getProgramsByChannelFailure: ['error'],

    getChannelsByCategoriesStart: null,
    getChannelsByCategories: ['input'],
    getChannelsByCategoriesSuccess: ['data'],
    getChannelsByCategoriesFailure: ['error'],

    favoritesStart: null,
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

    // misc
    reset: null,
    setPaginatorInfo: ['data'],
    resetPaginator: null,

    searchStart: null,
    search: ['input'],
    searchSuccess: ['data'],
    searchFailure: ['error'],

    //recent search
    updateRecentSearch: ['term'],

    getSimilarChannelStart: null,
    getSimilarChannel: ['input'],
    getSimilarChannelSuccess: ['data'],
    getSimilarChannelFailure: ['error']
  },
  { prefix: '@Isports/' }
);

export { Types, Creators };
