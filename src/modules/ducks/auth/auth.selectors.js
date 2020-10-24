import { createSelector } from 'reselect';

const selectAuth = (state) => state.auth;

export const selectCurrentUser = createSelector([selectAuth], ({ currentUser }) => {
  return currentUser;
});

export const selectIsFetching = createSelector([selectAuth], ({ isFetching }) => isFetching);

export const selectPortalAddress = createSelector(
  [selectAuth],
  ({ portalAddress }) => portalAddress
);
