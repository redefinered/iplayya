import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    getMovies: ['data'],
    getMoviesSuccess: ['data'],
    getMoviesFailure: ['error']
  },
  { prefix: '@Movies/' }
);

export { Types, Creators };
