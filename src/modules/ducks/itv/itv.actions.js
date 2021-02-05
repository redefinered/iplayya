import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    getChannels: ['paginatorInfo'],
    getChannelsSuccess: ['data'],
    getChannelsFailure: ['error']
  },
  { prefix: '@Itv/' }
);

export { Types, Creators };
