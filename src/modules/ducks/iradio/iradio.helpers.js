import clone from 'lodash/clone';

export const updateRadioStationsWithFavorited = (state, action) => {
  const { radioId } = action;
  const radioStations = clone(state.radioStations);

  /// favorited channel
  const radioStation = radioStations.find(({ id }) => parseInt(id) === radioId);

  /// clone channel so it is writable
  const channelClone = clone(radioStation);

  // /// update favorited channel
  const updatedRadioStation = Object.assign(channelClone, { is_favorite: true });

  // /// find index of the favorited channel
  const index = radioStations.findIndex(({ id }) => parseInt(id) === radioId);

  // /// update channels
  radioStations.splice(index, 1, updatedRadioStation);

  return radioStations;
};
