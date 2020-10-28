import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    getProfile: [],
    getProfileSuccess: ['data'],
    getProfileFailure: ['error'],
    removeCurrentUser: []
  },
  { prefix: '@Profile/' }
);

export { Types, Creators };
