import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    setBottomTabsVisible: ['data'],
    enableSwipe: ['isEnabled']
  },
  { prefix: '@Nav/' }
);

export { Types, Creators };
