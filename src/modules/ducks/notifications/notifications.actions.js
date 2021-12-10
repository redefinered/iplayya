import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    onRegister: ['token'],
    onNotif: ['notification'],
    setNotificationService: ['service'],

    markNotificationAsRead: ['notification'],
    clearNotifications: null,

    onNotifReset: null,

    /// actions from this point might all become useless moving forward
    deleteNotification: ['notificationId'],
    deactivateNotification: ['notificationId'],
    activateNotification: ['notificationId'],
    createNotification: ['notification'], /// an object
    updateNotificationStatus: ['id', 'status'], /// removing together with other notifcations actions that will be useless when notifications services is used to list notifications
    setSelectedForDeactivation: ['notificationId'],
    clearSelectedForDeactivation: null
  },
  { prefix: '@Notifications/' }
);

export { Types, Creators };
