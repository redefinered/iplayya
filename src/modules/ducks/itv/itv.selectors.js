import { createSelector } from 'reselect';

export const itvState = (state) => state.itv;

export const selectIsFetching = createSelector([itvState], ({ isFetching }) => isFetching);
export const selectError = createSelector([itvState], ({ error }) => error);
export const selectPaginatorInfo = createSelector([itvState], ({ paginatorInfo }) => paginatorInfo);
export const selectGenres = createSelector([itvState], ({ genres }) => genres);
export const selectChannels = createSelector([itvState], ({ channels }) => channels);
export const selectChannel = createSelector([itvState], ({ channel }) => channel);
export const selectFavorites = createSelector([itvState], ({ favorites }) => favorites);
export const selectPrograms = createSelector([itvState], ({ programs }) => programs.slice(1));
export const selectAddedToFavorites = createSelector(
  [itvState],
  ({ addedToFavorites }) => addedToFavorites
);
export const selectRemovedFromFavorites = createSelector(
  [itvState],
  ({ removedFromFavorites }) => removedFromFavorites
);
export const selectDownloads = createSelector([itvState], ({ downloads }) => downloads);
export const selectChannelName = createSelector([itvState], ({ channel }) => {
  if (!channel) return;
  return channel.title;
});
export const selectChannelUrl = createSelector([itvState], ({ channel }) => {
  if (!channel) return;
  return channel.archived_link;
});
export const selectCurrentProgram = createSelector([itvState], ({ programs }) => {
  if (!programs.length) return;

  return programs[0];
});
