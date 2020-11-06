import { createActions } from 'reduxsauce';

const { Types, Actions } = createActions(
  {
    getLinkStart: [],
    getLink: ['data'],
    getLinkSuccess: ['data'],
    getLinkFailure: ['error'],
    updateStart: ['data'],
    update: ['data'],
    updateSuccess: ['data'],
    updateFailure: ['error']
  },
  { prefix: '@Password/' }
);

export { Types, Actions };
