import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    getLinkStart: [],
    getLink: ['data'],
    getLinkSuccess: ['data'],
    getLinkFailure: ['error'],
    updateStart: ['data'],
    update: ['data'],
    updateSuccess: ['data'],
    updateFailure: ['error'],
    changePassword: ['data'],
    changePasswordSuccess: null,
    changePasswordFailure: ['error'],
    resetUpdateParams: []
  },
  { prefix: '@Password/' }
);

export { Types, Creators };
