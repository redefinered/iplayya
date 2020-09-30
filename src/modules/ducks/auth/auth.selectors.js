import { createSelector } from 'reselect';

const selectAuth = (state) => state.auth;

export const selectCurrentUser = createSelector([selectAuth], ({ currentUser }) => currentUser);

export const selectPortalAddress = createSelector(
  [selectAuth],
  ({ portalAddress }) => portalAddress
);
