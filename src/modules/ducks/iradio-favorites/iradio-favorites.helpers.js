import clone from 'lodash/clone';

export const filterOutRemovedItems = (state, action) => {
  const { radios } = action;
  const c = clone(state.addedToFavorites);
  const removedIds = radios.map(({ id }) => id);

  return c.filter(({ id }) => !removedIds.includes(id));
};

export const updateAddedToFavorites = (state, action) => {
  const { radio } = action;
  const c = clone(state.addedToFavorites);
  return [radio, ...c];
};
