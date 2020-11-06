import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    registerStart: [],
    register: ['data'],
    registerSuccess: [],
    registerFailure: ['error'],
    signIn: ['data'],
    signInSuccess: [],
    signInFailure: ['error'],
    signOut: [],
    signOutSuccess: [],
    signOutFailure: ['error'],
    getProfile: [],
    getProfileSuccess: ['data'],
    getProfileFailure: ['error'],
    clearResetPasswordParams: [],
    purgeStore: [] // for development
  },
  { prefix: '@Auth/' }
);

export { Types, Creators };
