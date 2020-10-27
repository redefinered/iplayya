import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions({
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
});

export { Types, Creators };
