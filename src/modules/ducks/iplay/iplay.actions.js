import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    addVideoFiles: ['files'],
    deleteVideoFiles: ['fileIds']
  },
  { prefix: '@Iplay/' }
);

export { Types, Creators };
