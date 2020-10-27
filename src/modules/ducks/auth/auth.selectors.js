import { createSelector } from 'reselect';

const selectAuth = (state) => state.auth;

export const selectCurrentUser = createSelector([selectAuth], ({ currentUser }) => {
  return currentUser;
});

export const selectIsLoggedIn = createSelector([selectAuth], ({ isLoggedIn }) => isLoggedIn);

export const selectIsFetching = createSelector([selectAuth], ({ isFetching }) => isFetching);

export const selectError = createSelector([selectAuth], ({ error }) => error);

export const selectPortalAddress = createSelector(
  [selectAuth],
  ({ portalAddress }) => portalAddress
);
