import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    addStart: [],
    add: [],
    addSuccess: ['data'],
    addFailure: ['error'],
    getStart: [],
    get: [],
    getSuccess: ['data'],
    getFailure: ['error'],
    createStart: [],
    create: ['data'],
    createSuccess: ['data'],
    createFailure: ['error'],
    updateStart: [],
    update: [],
    updateSuccess: ['data'],
    updateFailure: ['error'],
    deleteStart: [],
    delete: ['data'],
    deleteSuccess: [],
    deleteFailure: ['error']
  },
  { prefix: '@Provider/' }
);

export { Types, Creators };
