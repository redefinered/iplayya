import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    setBottomTabsVisible: ['data']
  },
  { prefix: '@Nav/' }
);

export { Types, Creators };
