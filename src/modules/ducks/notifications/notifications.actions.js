import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    onRegister: ['token'],
    onNotif: ['notification'],

    onNotifReset: null,

    createNotification: ['notification'], /// an object
    activateNotification: ['notificationId'],
    deactivateNotification: ['notificationId'],
    deleteNotification: ['notificationId'],
    updateNotificationStatus: ['id', 'status'],

    setSelectedForDeactivation: ['notificationId'],
    clearSelectedForDeactivation: null
  },
  { prefix: '@Notifications/' }
);

export { Types, Creators };
