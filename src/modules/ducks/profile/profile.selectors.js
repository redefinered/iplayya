import { createSelector } from 'reselect';

const selectAuth = (state) => state.profile;

export const selectCurrentUser = createSelector([selectAuth], ({ currentUser }) => {
  return currentUser;
});
