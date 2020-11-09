import { createSelector } from 'reselect';

const passwordState = (state) => state.password;

export const selectError = createSelector([passwordState], ({ error }) => error);

export const selectIsFetching = createSelector([passwordState], ({ isFetching }) => isFetching);

export const selectGetLinkResponse = createSelector(
  [passwordState],
  ({ getLinkResponse }) => getLinkResponse
);

export const selectUpdateParams = createSelector(
  [passwordState],
  ({ updateParams }) => updateParams
);

export const selectUpdateResponse = createSelector(
  [passwordState],
  ({ updateResponse }) => updateResponse
);

export const selectUpdated = createSelector([passwordState], ({ updated }) => updated);
