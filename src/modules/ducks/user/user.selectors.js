import { createSelector } from 'reselect';

export const userState = (state) => state.user;

export const selectSkippedProviderAdd = createSelector(
  [userState],
  ({ skippedProviderAdd }) => skippedProviderAdd
);

export const selectCompletedOnboarding = createSelector(
  [userState],
  ({ completedOnboarding }) => completedOnboarding
);
