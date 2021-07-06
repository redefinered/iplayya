import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    registerStart: [],
    register: ['data'],
    registerSuccess: [],
    registerFailure: ['error'],
    signInStart: [],
    signIn: ['data'],
    signInSuccess: ['user'],
    signInFailure: ['error'],
    signOut: [],
    signOutSuccess: [],
    signOutFailure: ['error'],
    getProfile: [],
    getProfileSuccess: ['data'],
    getProfileFailure: ['error'],
    clearResetPasswordParams: [],
    setOnboardingComplete: null,
    reset: null
  },
  { prefix: '@Auth/' }
);

export { Types, Creators };
