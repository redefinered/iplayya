import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    addProvider: ['data']
  },
  { prefix: '@IPTV/' }
);

export { Types, Creators };
