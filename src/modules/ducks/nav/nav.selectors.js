import { createSelector } from 'reselect';

const selectNav = (state) => state.nav;

export const selectHideTabs = createSelector([selectNav], ({ hideTabs }) => hideTabs);
