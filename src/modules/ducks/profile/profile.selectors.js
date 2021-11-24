import { createSelector } from 'reselect';
// import { authState } from 'modules/ducks/auth/auth.selectors';

export const profileState = (state) => state.profile;

export const selectProfile = createSelector([profileState], ({ profile }) => profile);
export const selectError = createSelector([profileState], ({ error }) => error);
export const selectIsFetching = createSelector([profileState], ({ isFetching }) => isFetching);
export const selectUpdated = createSelector([profileState], ({ updated }) => updated);

// get profile from auth state
export const selectOnboardinginfo = createSelector([profileState], ({ profile }) => {
  if (!profile) return;

  const { onboardinginfo } = profile;

  // return an empty object if onboadinginfo is an empty string. means nothing has been set yet
  if (!onboardinginfo) return {};

  return JSON.parse(onboardinginfo);
});

export const selectAuthenticatedEmailChange = createSelector(
  [profileState],
  ({ authenticatedEmailChange }) => authenticatedEmailChange
);
