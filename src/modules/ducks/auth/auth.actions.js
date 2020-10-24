import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions({
  hello: ['data'],
  helloSuccess: ['data'],
  helloFailure: ['error'],
  setPortalAddress: ['data'],
  signOut: [],
  signIn: ['data'],
  signInSuccess: ['data'],
  signInFailure: ['error'],
  purgeStore: [] // for development
});

export { Types, Creators };
