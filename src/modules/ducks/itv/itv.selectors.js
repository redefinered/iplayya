import { createSelector } from 'reselect';

export const itvState = (state) => state.itv;

export const selectIsFetching = createSelector([itvState], ({ isFetching }) => isFetching);
export const selectError = createSelector([itvState], ({ error }) => error);

export const selectPaginator = createSelector([itvState], ({ paginator }) => paginator);

export const selectFavoritesPaginator = createSelector(
  [itvState],
  ({ favoritesPaginator }) => favoritesPaginator
);

export const selectGenres = createSelector([itvState], ({ genres }) => genres);
export const selectChannels = createSelector([itvState], ({ channels }) => channels);
export const selectChannel = createSelector([itvState], ({ channel }) => channel);
export const selectFavorites = createSelector([itvState], ({ favorites }) => favorites);
export const selectPrograms = createSelector([itvState], ({ programs }) => programs);
export const selectDownloads = createSelector([itvState], ({ downloads }) => downloads);
export const selectChannelName = createSelector([itvState], ({ channel }) => {
  if (!channel) return;
  return channel.title;
});
export const selectChannelUrl = createSelector([itvState], ({ channel }) => {
  if (!channel) return;
  return channel.archived_link;
});

const selectChannelForFilter = (state, props) => {
  return state.itv.channels.find(({ id }) => id === props.channelId);
};

export const selectCurrentProgram = createSelector([selectChannelForFilter], (channel) => {
  if (!channel) return;

  return channel;
});

export const selectSearchResults = createSelector([itvState], ({ searchResults }) => searchResults);

export const selectFavoritesListUpdated = createSelector(
  [itvState],
  ({ favoritesListUpdated }) => favoritesListUpdated
);

export const selectfavoritesListRemoveUpdated = createSelector(
  [itvState],
  ({ favoritesListRemoveUpdated }) => favoritesListRemoveUpdated
);

export const selectSearchResultsPaginator = createSelector(
  [itvState],
  ({ searchResultsPaginator }) => searchResultsPaginator
);

export const selectRecentSearch = createSelector([itvState], ({ recentSearch }) => recentSearch);

export const selectNotifications = createSelector([itvState], ({ notifications }) => notifications);
export const selectSubscriptions = createSelector([itvState], ({ subscriptions }) => subscriptions);

// const selectChannelForFilter = (state, props) => {
//   return state.itv.channels.find(({ id }) => id === props.channelId)
// }

// const selectCurrentProgram

const selectChannelsAndCurrentChannelNumberForFilter = (
  { itv: { channels } },
  { channel: { number } }
) => {
  const currentChannelNumber = parseInt(number);
  return { channels: channels.map(({ id, number }) => ({ id, number })), currentChannelNumber };
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
