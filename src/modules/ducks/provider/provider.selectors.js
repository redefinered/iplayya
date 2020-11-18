import { createSelector } from 'reselect';
import { profileState } from 'modules/ducks/profile/profile.selectors';

export const providerState = (state) => state.provider;

export const selectError = createSelector([providerState], ({ error }) => error);

export const selectIsFetching = createSelector([providerState], ({ isFetching }) => isFetching);

export const selectProviders = createSelector([profileState], ({ profile }) => {
  if (!profile) return []; // return an empty array to avoid breaking the app
  return profile.providers;
});

export const selectSkipProviderAdd = createSelector(
  [providerState],
  ({ skipProviderAdd }) => skipProviderAdd
);

export const selectCreated = createSelector([providerState], ({ created }) => created);

export const selectDeleted = createSelector([providerState], ({ deleted }) => deleted);
