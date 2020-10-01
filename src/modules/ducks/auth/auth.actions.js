import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions({
  hello: ['data'],
  helloSuccess: ['data'],
  helloFailure: ['error'],
  setPortalAddress: ['data'],
  signOut: [],
  purgeStore: [] // for development
});

export { Types, Creators };
