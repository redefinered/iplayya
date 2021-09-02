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
    reset: null,
    setPaginatorInfo: ['data'],
    resetPaginator: [],

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
