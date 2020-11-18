import { createSelector } from 'reselect';

export const profileState = (state) => state.profile;

export const selectProfile = createSelector([profileState], ({ profile }) => profile);

export const selectError = createSelector([profileState], ({ error }) => error);

export const selectIsFetching = createSelector([profileState], ({ isFetching }) => isFetching);

export const selectUpdated = createSelector([profileState], ({ updated }) => updated);
