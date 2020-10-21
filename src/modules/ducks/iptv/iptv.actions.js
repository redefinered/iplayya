import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions({
  addProvider: ['data']
});

export { Types, Creators };
