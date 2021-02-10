import { createSelector } from 'reselect';

export const itvState = (state) => state.itv;

export const selectIsFetching = createSelector([itvState], ({ isFetching }) => isFetching);
export const selectError = createSelector([itvState], ({ error }) => error);
export const selectPaginatorInfo = createSelector([itvState], ({ paginatorInfo }) => paginatorInfo);
export const selectGenres = createSelector([itvState], ({ genres }) => genres);
export const selectChannels = createSelector([itvState], ({ channels }) => channels);
