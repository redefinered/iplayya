import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    searchStart: null,
    search: ['input'],
    searchSuccess: ['data'],
    searchFailure: ['error'],

    setIsSearching: ['isSearching'],

    getSimilarGenreStart: [],
    getSimilarGenre: ['input'],
    getSimilarGenreSuccess: ['data'],
    getSimilarGenreFailure: ['error'],

    setPaginatorInfo: ['data'],
    resetPaginator: null
  },
  { prefix: '@ImusicSearch/' }
);

export { Types, Creators };
