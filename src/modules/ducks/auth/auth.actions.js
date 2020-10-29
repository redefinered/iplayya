import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    register: ['data'],
    signIn: ['data'],
    signInSuccess: [],
    signInFailure: ['error'],
    signOut: [],
    signOutSuccess: [],
    signOutFailure: ['error'],
    getProfile: [],
    getProfileSuccess: ['data'],
    getProfileFailure: ['error'],
    purgeStore: [] // for development
  },
  { prefix: '@Auth/' }
);

export { Types, Creators };
