import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    getProfile: [],
    getProfileSuccess: ['data'],
    getProfileFailure: ['error']
  },
  { prefix: '@Profile/' }
);

export { Types, Creators };
