import { createSelector } from 'reselect';

const selectProfile = (state) => state.profile;

export const selectCurrentUser = createSelector([selectProfile], ({ currentUser }) => {
  return currentUser;
});

export const selectError = createSelector([selectProfile], ({ error }) => error);

export const selectIsFetching = createSelector([selectProfile], ({ isFetching }) => isFetching);
