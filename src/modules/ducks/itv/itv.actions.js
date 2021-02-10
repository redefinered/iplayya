import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    /// query: GET_GENRES
    getGenres: [],
    getGenresSuccess: ['data'],
    getGenresFailure: ['error'],

    /// get channels
    getChannels: ['input'],
    getChannelsSuccess: ['data'],
    getChannelsFailure: ['error'],

    getChannelsByCategories: ['input'],
    getChannelsByCategoriesSuccess: ['data'],
    getChannelsByCategoriesFailure: ['error'],

    // misc
    reset: [],
    setPaginatorInfo: ['data']
  },
  { prefix: '@Itv/' }
);

export { Types, Creators };
