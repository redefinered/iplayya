import { createSelector } from 'reselect';

const notificationsState = (state) => state.notifications;

export const selectNotifications = createSelector(
  [notificationsState],
  ({ notifications }) => notifications
);
export const selectSubscriptions = createSelector(
  [notificationsState],
  ({ subscriptions }) => subscriptions
);
