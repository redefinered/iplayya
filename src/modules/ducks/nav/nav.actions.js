import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions({
  setBottomTabsVisible: ['data']
});

export { Types, Creators };
