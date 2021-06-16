import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    registerStart: [],
    register: ['data'],
    registerSuccess: [],
    registerFailure: ['error'],
    signInStart: [],
    signIn: ['data'],
    signInSuccess: ['data'],
    signInFailure: ['error'],
    signOut: [],
    signOutSuccess: [],
    signOutFailure: ['error'],
    getProfile: [],
    getProfileSuccess: ['data'],
    getProfileFailure: ['error'],
    clearResetPasswordParams: [],
    reset: [],
    setNetworkInfo: ['data']
  },
  { prefix: '@Auth/' }
);

export { Types, Creators };
