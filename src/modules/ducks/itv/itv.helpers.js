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

/**
 * Updates the notofication with the given id and returns the updated array
 * @param {Array} notifications array of current notifications
 * @param {String} notificationId id of the notification to modify
 * @returns an updated array
 */
// export const turnOffNotificationById = (state, action) => {
//   const { notifications } = state;

//   /// get the notification to modify
//   const notification = notifications.find(({ id }) => id === action.notificationId);

//   /// get the index of the notification to modify
//   const notificationIdex = notifications.findIndex(({ id }) => id === action.notificationId);

//   /// set active property of the target notification to false
//   const updatedNotif = Object.assign(notification, { active: false });

//   /// update notifications replacing the outdated one with the updated
//   notifications.splice(notificationIdex, 1, updatedNotif);

//   return notifications;
// };

export const activateSubscriptionById = (state, action) => {
  const { subscriptions } = state;

  /// get the notification to modify
  const subscription = subscriptions.find(({ id }) => id === action.subscriptionId);

  /// get the index of the subscription to modify
  const subscriptionIdex = subscriptions.findIndex(({ id }) => id === action.subscriptionId);

  /// set active property of the target subscription to true
  const updatedSubscription = Object.assign(subscription, { status: 1 });

  /// update subscriptions replacing the outdated one with the updated
  subscriptions.splice(subscriptionIdex, 1, updatedSubscription);

  return subscriptions;
};

export const deactivateSubscriptionById = (state, action) => {
  const { subscriptions } = state;

  /// get the notification to modify
  const subscription = subscriptions.find(({ id }) => id === action.subscriptionId);

  /// get the index of the subscription to modify
  const subscriptionIdex = subscriptions.findIndex(({ id }) => id === action.subscriptionId);

  /// set active property of the target subscription to true
  const updatedSubscription = Object.assign(subscription, { status: 0 });

  /// update subscriptions replacing the outdated one with the updated
  subscriptions.splice(subscriptionIdex, 1, updatedSubscription);

  return subscriptions;
};

export const setNotificationToReadById = (state, action) => {
  const { notifications } = state;

  /// get the notification to modify
  const notification = notifications.find(({ id }) => id === action.notificationId);

  /// get the index of the notification to modify
  const notificationIdex = notifications.findIndex(({ id }) => id === action.notificationId);

  /// set read property of the target notification to true
  const updatedNotif = Object.assign(notification, { read: true });

  /// update notifications replacing the outdated one with the updated
  notifications.splice(notificationIdex, 1, updatedNotif);

  return notifications;
};
