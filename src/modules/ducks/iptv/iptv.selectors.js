import { createSelector } from 'reselect';

// select iptvReducer
const selectIptv = (state) => state.iptv;

export const selectProviders = createSelector([selectIptv], ({ providers }) => {
  console.log({ providers });
  return providers;
});
