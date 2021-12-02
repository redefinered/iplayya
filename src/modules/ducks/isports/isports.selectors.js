import { createSelector } from 'reselect';

export const iSportsState = (state) => state.sports;

export const selectIsFetching = createSelector([iSportsState], ({ isFetching }) => isFetching);
export const selectError = createSelector([iSportsState], ({ error }) => error);
export const selectPaginator = createSelector([iSportsState], ({ paginator }) => paginator);
export const selectPaginatorInfo = createSelector(
  [iSportsState],
  ({ paginatorInfo }) => paginatorInfo
);
export const selectFavoritesPaginator = createSelector(
  [iSportsState],
  ({ favoritesPaginator }) => favoritesPaginator
);

export const selectGenres = createSelector([iSportsState], ({ genres }) => genres);
export const selectChannels = createSelector([iSportsState], ({ channels }) => channels);
export const selectChannel = createSelector([iSportsState], ({ channel }) => channel);
export const selectFavorites = createSelector([iSportsState], ({ favorites }) => favorites);
export const selectPrograms = createSelector([iSportsState], ({ programs }) => programs);
export const selectFavoritesListRemoveUpdated = createSelector(
  [iSportsState],
  ({ favoritesListRemoveUpdated }) => favoritesListRemoveUpdated
);

export const selectFavoritesListUpdated = createSelector(
  [iSportsState],
  ({ favoritesListUpdated }) => favoritesListUpdated
);

const selectChannelForFilter = (state, props) => {
  return state.sports.channels.find(({ id }) => id === props.channelId);
};

export const selectCurrentProgram = createSelector([selectChannelForFilter], (channel) => {
  if (!channel) return;

  return channel;
});

export const selectSearchResults = createSelector(
  [iSportsState],
  ({ searchResults }) => searchResults
);

export const selectRecentSearch = createSelector(
  [iSportsState],
  ({ recentSearch }) => recentSearch
);

export const selectSimilarChannel = createSelector(
  [iSportsState],
  ({ similarChannel }) => similarChannel
);

const selectChannelsAndCurrentChannelNumberForFilter = (
  { sports: { channels } },
  { channel: { number } }
) => {
  const currentChannelNumber = parseInt(number);
  return { channels, currentChannelNumber };
};

export const selectNextChannel = createSelector(
  [selectChannelsAndCurrentChannelNumberForFilter],
  ({ channels, currentChannelNumber }) => {
    const nextChannel = channels.find(({ number }) => number === currentChannelNumber + 1);
    return nextChannel;
  }
);

export const selectPreviousChannel = createSelector(
  [selectChannelsAndCurrentChannelNumberForFilter],
  ({ channels, currentChannelNumber }) => {
    const previousChannel = channels.find(({ number }) => number === currentChannelNumber - 1);
    return previousChannel;
  }
);

export const selectIsSearching = createSelector([iSportsState], ({ isSearching }) => isSearching);
