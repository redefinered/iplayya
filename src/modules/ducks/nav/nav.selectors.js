import { createSelector } from 'reselect';

const selectNav = (state) => state.nav;

export const selectHideTabs = createSelector([selectNav], ({ hideTabs }) => hideTabs);

export const selectSwipeEnabled = createSelector([selectNav], ({ swipeEnabled }) => {
  console.log('yyy', swipeEnabled);
  return swipeEnabled;
});
