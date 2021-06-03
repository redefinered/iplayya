import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    getOne: ['data'],
    getOneSuccess: ['data'],
    getOneFailure: ['error'],
    get: ['data'],
    getSuccess: ['data'],
    getFailure: ['error'],
    playbackStart: [],
    updatePlaybackInfo: ['data']
  },
  { prefix: '@Music/' }
);

export { Types, Creators };
