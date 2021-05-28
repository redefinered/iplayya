import { createSelector } from 'reselect';

export const iplayState = (state) => state.iplay;

export const selectVideoFiles = createSelector([iplayState], ({ videoFiles }) => videoFiles);
