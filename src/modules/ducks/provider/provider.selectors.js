import { createSelector } from 'reselect';
import { profileState } from 'modules/ducks/profile/profile.selectors';

export const providerState = (state) => state.provider;

export const selectError = createSelector([providerState], ({ error }) => error);

export const selectIsFetching = createSelector(
  [providerState, profileState],
  ({ isFetching }, { isFetching: profileIsFetching }) => {
    // TODO: this selector neeeds more testing, e.g. iptv screen should still be loading when
    // profile is currently being fetched by the time the user lands on it
    if (isFetching || profileIsFetching) return true;
    return false;
  }
);

export const selectProviders = createSelector([profileState], ({ profile }) => {
  if (!profile) return []; // return an empty array to avoid breaking the app
  return profile.providers;
});

export const selectSkipProviderAdd = createSelector(
  [providerState],
  ({ skipProviderAdd }) => skipProviderAdd
);

export const selectCreated = createSelector([providerState], ({ created }) => created);

export const selectUpdated = createSelector([providerState], ({ updated }) => updated);

export const selectDeleted = createSelector([providerState], ({ deleted }) => deleted);

export const selectCurrentProvider = createSelector(
  [providerState],
  ({ currentProvider }) => currentProvider
);
