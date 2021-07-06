import { createSelector } from 'reselect';
import { profileState } from 'modules/ducks/profile/profile.selectors';

export const userState = (state) => state.user;

export const selectError = createSelector([userState], ({ error }) => error);

export const selectIsFetching = createSelector([userState], ({ isFetching }) => isFetching);

export const selectSkippedProviderAdd = createSelector(
  [userState],
  ({ skippedProviderAdd }) => skippedProviderAdd
);

// export const selectCompletedOnboarding = createSelector(
//   [userState],
//   ({ completedOnboarding }) => completedOnboarding
// );

export const selectPlaybackSettings = createSelector(
  [profileState],
  ({ profile: { playback } }) => playback
);

export const selectUpdated = createSelector([userState], ({ updated }) => updated);
