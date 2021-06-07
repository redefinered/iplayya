import { createSelector } from 'reselect';

export const musicState = (state) => state.music;

export const selectError = createSelector([musicState], ({ error }) => error);

export const selectIsFetching = createSelector([musicState], ({ isFetching }) => isFetching);

export const selectPaginatorInfo = createSelector(
  [musicState],
  ({ paginatorInfo }) => paginatorInfo
);

export const selectGenrePaginator = createSelector(
  [musicState],
  ({ genrePaginator }) => genrePaginator
);
