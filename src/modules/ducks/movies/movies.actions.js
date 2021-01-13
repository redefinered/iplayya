import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    getCategoriesSuccess: ['data'],
    getMoviesByCategories: ['input'],
    getMoviesByCategoriesSuccess: ['movies'],
    getMoviesByCategoriesFailure: ['error'],
    playbackStart: [],
    updatePlaybackInfo: ['data']
  },
  { prefix: '@Movie/' }
);

export { Types, Creators };
