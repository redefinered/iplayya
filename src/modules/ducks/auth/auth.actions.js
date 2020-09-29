import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions({
  hello: ['data'],
  helloSuccess: ['data'],
  helloFailure: ['error'],
  purgeStore: [] // for development
});

export { Types, Creators };
