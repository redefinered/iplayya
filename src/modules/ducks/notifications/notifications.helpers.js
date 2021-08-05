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

export const activateNotificationById = (state, action) => {
  const { notifications } = state;
  const { notificationId } = action;

  /// get the notification to modify
  const notification = notifications.find(({ id }) => id === notificationId);

  /// if not found return the current notifications
  if (typeof notification === 'undefined') return notifications;

  /// get the index of the notification to modify
  const notificationIdex = notifications.findIndex(({ id }) => id === notificationId);

  /// set active property of the target notification to true
  const updatedNotification = Object.assign(notification, { active: true });

  /// update notifications replacing the outdated one with the updated
  notifications.splice(notificationIdex, 1, updatedNotification);

  return notifications;
};

export const deactivateNotificationById = (state, action) => {
  const { notifications } = state;
  const { notificationId } = action;

  /// get the notification to modify
  const notification = notifications.find(({ id }) => id === notificationId);

  /// if not found return the current notifications
  if (typeof notification === 'undefined') return notifications;

  /// get the index of the notification to modify
  const notificationIdex = notifications.findIndex(({ id }) => id === notificationId);

  /// set active property of the target notification to true
  const updatedNotification = Object.assign(notification, { active: false });

  /// update notifications replacing the outdated one with the updated
  notifications.splice(notificationIdex, 1, updatedNotification);

  return notifications;
};

// export const setNotificationToReadById = (state, action) => {
//   const { notifications } = state;

//   /// get the notification to modify
//   const notification = notifications.find(({ id }) => id === action.notificationId);

//   /// get the index of the notification to modify
//   const notificationIdex = notifications.findIndex(({ id }) => id === action.notificationId);

//   /// set read property of the target notification to true
//   const updatedNotif = Object.assign(notification, { read: true });

//   /// update notifications replacing the outdated one with the updated
//   notifications.splice(notificationIdex, 1, updatedNotif);

//   return notifications;
// };

export const setNotificationToUnreadById = (state, action) => {
  const { notifications } = state;
  const { id: notificationId } = action.notification;

  /// get the notification to modify
  const notification = notifications.find(({ id }) => id === notificationId);

  /// if not found return the current notifications
  if (typeof notification === 'undefined') return notifications;

  /// get the index of the notification to modify
  const notificationIdex = notifications.findIndex(({ id }) => id === notificationId);

  /// set status property of the target notification to 1 means unread
  const updatedNotification = Object.assign(notification, {
    status: 1,
    createdAt: new Date(Date.now())
  });

  /// update notifications replacing the outdated one with the updated
  notifications.splice(notificationIdex, 1, updatedNotification);

  return notifications;
};

export const updateNotificationStatus = (state, action) => {
  const { notifications } = state;
  const { id: notificationId, status } = action;

  /// get the notification to modify
  const notification = notifications.find(({ id }) => id === notificationId);

  /// if not found return the current notifications
  if (typeof notification === 'undefined') return notifications;

  /// get the index of the notification to modify
  const notificationIdex = notifications.findIndex(({ id }) => id === notificationId);

  /// set status property of the target notification to action payload status
  const updatedNotification = Object.assign(notification, { status });

  /// update notifications replacing the outdated one with the updated
  notifications.splice(notificationIdex, 1, updatedNotification);

  return notifications;
};
