import { createSelector } from 'reselect';

export const authState = (state) => state.auth;

export const selectCurrentUser = createSelector([authState], ({ currentUser }) => currentUser);
export const selectCurrentUserId = createSelector([authState], ({ currentUser }) =>
  currentUser ? currentUser.id : currentUser
);
export const selectIsLoggedIn = createSelector([authState], ({ isLoggedIn }) => isLoggedIn);
export const selectIsFetching = createSelector([authState], ({ isFetching }) => isFetching);
export const selectError = createSelector([authState], ({ error }) => error);
export const selectSignedUp = createSelector([authState], ({ signedUp }) => signedUp);
export const selectNetworkInfo = createSelector([authState], ({ networkInfo }) => networkInfo);
export const selectIsValidUsername = createSelector(
  [authState],
  ({ selectIsValidUsername }) => selectIsValidUsername
);
export const selectIsInitialSignIn = createSelector(
  [authState],
  ({ isInitialSignIn }) => isInitialSignIn
);
