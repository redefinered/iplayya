import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    setCurrentUser: ['data'],
    removeCurrentUser: [],
    skipProviderAdd: []
  },
  { prefix: '@User/' }
);

export { Types, Creators };
