import { createSelector } from 'reselect';
import { profileState } from 'modules/ducks/profile/profile.selectors';
// import { userState } from 'modules/ducks/user/user.selectors';

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

// eslint-disable-next-line no-unused-vars
export const selectProviders = createSelector([profileState], ({ profile }) => {
  if (!profile) return []; // return an empty array to avoid breaking the app

  const { providers } = profile;

  if (typeof providers === 'undefined') return [];

  return providers;
});

export const selectIsProviderSetupSkipped = createSelector([profileState], ({ profile }) => {
  /// on login, profile object in profile state is null so return
  if (!profile) return;

  const { onboardinginfo } = profile;

  // if onboarding info is null means provider add is not yet skipped
  if (!onboardinginfo) return false;

  const { skippedProviderSetup } = JSON.parse(onboardinginfo);

  /// if skippedProviderSetup is not yet defined, provider add is not yet skipped
  if (typeof skippedProviderSetup === 'undefined') return false;

  /// if skipped provider is defined and false return false
  if (!skippedProviderSetup) return false;

  return true;
});

export const selectCreated = createSelector([providerState], ({ created }) => created);

export const selectUpdated = createSelector([providerState], ({ updated }) => updated);

export const selectDeleted = createSelector([providerState], ({ deleted }) => deleted);

export const selectCurrentProvider = createSelector(
  [providerState],
  ({ currentProvider }) => currentProvider
);
