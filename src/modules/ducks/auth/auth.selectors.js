import { createSelector } from 'reselect';

const selectAuth = (state) => state.auth;

export const selectCurrentUser = createSelector([selectAuth], ({ currentUser }) => {
  return currentUser;
});

export const selectIsLoggedIn = createSelector([selectAuth], ({ isLoggedIn }) => isLoggedIn);

export const selectIsFetching = createSelector([selectAuth], ({ isFetching }) => isFetching);

export const selectError = createSelector([selectAuth], ({ error }) => error);

export const selectSignedUp = createSelector([selectAuth], ({ signedUp }) => signedUp);

export const selectPwResetLinkMessage = createSelector(
  [selectAuth],
  ({ pwResetLinkMessage }) => pwResetLinkMessage
);

export const selectResetPasswordParams = createSelector(
  [selectAuth],
  ({ resetPasswordParams }) => resetPasswordParams
);

export const selectResetMessage = createSelector([selectAuth], ({ resetMessage }) => resetMessage);

export const selectPasswordUpdated = createSelector(
  [selectAuth],
  ({ passwordUpdated }) => passwordUpdated
);

export const selectUpdatingPassword = createSelector(
  [selectAuth],
  ({ updatingPassword }) => updatingPassword
);
