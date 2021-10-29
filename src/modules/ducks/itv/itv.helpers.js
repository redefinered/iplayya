import clone from 'lodash/clone';

export const updateChannelsWithFavorited = (state, action) => {
  const { videoId } = action;
  const channels = clone(state.channels);

  /// favorited channel
  const channel = channels.find(({ id }) => parseInt(id) === videoId);

  /// clone channel so it is writable
  const channelClone = clone(channel);

  // /// update favorited channel
  const updatedChannel = Object.assign(channelClone, { is_favorite: true });

  // /// find index of the favorited channel
  const index = channels.findIndex(({ id }) => parseInt(id) === videoId);

  // /// update channels
  channels.splice(index, 1, updatedChannel);

  return channels;
};
