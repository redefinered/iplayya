import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    start: [],
    get: [],
    getSuccess: ['profile'],
    getFailure: ['error'],
    updateStart: [],
    update: ['data'],
    updateSuccess: ['data'],
    updateFailure: ['error'],
    removeProfile: []
  },
  { prefix: '@Profile/' }
);

export { Types, Creators };
