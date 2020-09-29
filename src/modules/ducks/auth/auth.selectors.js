import { createSelector } from 'reselect';

const selectAuth = (state) => state.auth;

export const selectCurrentUser = createSelector([selectAuth], ({ currentUser }) => currentUser);
