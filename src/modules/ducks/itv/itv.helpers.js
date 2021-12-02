import clone from 'lodash/clone';

export const updateChannelsWithFavorited = (state, action) => {
  const { id: channelId } = action;
  const channels = clone(state.channels);

  console.log({ channelId });

  /// favorited channel
  const channel = channels.find(({ id }) => id === channelId);

  console.log({ channel });

  /// stop ececution if channel is not found from the list
  if (typeof channel === 'undefined') return channels;

  /// clone channel so it is writable
  const channelClone = clone(channel);

  // /// update favorited channel
  const updatedChannel = Object.assign(channelClone, { is_favorite: true });

  // /// find index of the favorited channel
  const index = channels.findIndex(({ id }) => parseInt(id) === channelId);

  // /// update channels
  channels.splice(index, 1, updatedChannel);

  return channels;
};
