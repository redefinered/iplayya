import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    searchStart: null,
    search: ['input', 'shouldIncrement'],
    searchSuccess: ['results', 'nextPaginatorInfo'],
    searchFailure: ['error'],
    resetSearchResultsPaginator: null
  },
  { prefix: '@ImusicFavorites/' }
);

export { Types, Creators };
