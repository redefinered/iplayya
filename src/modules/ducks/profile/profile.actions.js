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
    authenticateEmailChange: ['data'],
    authenticateEmailChangeSuccess: null,
    authenticateEmailChangeFailure: ['error'],
    removeProfile: []
  },
  { prefix: '@Profile/' }
);

export { Types, Creators };
