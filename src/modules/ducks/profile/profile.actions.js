import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    start: [],
    get: [],
    getSuccess: ['data'],
    getFailure: ['error'],
    updateStart: [],
    update: ['data'],
    updateSuccess: ['data'],
    updateFailure: ['error'],
    removeCurrentUser: []
  },
  { prefix: '@Profile/' }
);

export { Types, Creators };
