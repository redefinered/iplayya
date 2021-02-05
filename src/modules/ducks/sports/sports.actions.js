import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    getMovie: ['data'],
    getMovieSuccess: ['data'],
    getMovieFailure: ['error'],
    getMovies: ['data'],
    getMoviesSuccess: ['data'],
    getMoviesFailure: ['error'],
    playbackStart: [],
    updatePlaybackInfo: ['data']
  },
  { prefix: '@Movie/' }
);

export { Types, Creators };
