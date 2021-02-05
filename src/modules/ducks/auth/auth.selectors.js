import { createSelector } from 'reselect';

const authState = (state) => state.auth;

export const selectCurrentUser = createSelector([authState], ({ currentUser }) => currentUser);

export const selectIsLoggedIn = createSelector([authState], ({ isLoggedIn }) => isLoggedIn);

export const selectIsFetching = createSelector([authState], ({ isFetching }) => isFetching);

export const selectError = createSelector([authState], ({ error }) => error);

export const selectSignedUp = createSelector([authState], ({ signedUp }) => signedUp);
