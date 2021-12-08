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

export const selectNotification = createSelector(
  [notificationsState],
  ({ notification }) => notification
);

export const selectSelectedForDeactivation = createSelector(
  [notificationsState],
  ({ selectedForDeactivation }) => selectedForDeactivation
);

export const selectNotificationService = createSelector(
  [notificationsState],
  ({ notificationService }) => notificationService
);

export const selectReadNotifications = createSelector(
  [notificationsState],
  ({ readNotifications }) => readNotifications
);
