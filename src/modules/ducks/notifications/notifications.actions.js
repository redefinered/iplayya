import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    onRegister: ['token'],
    onNotif: ['notification'],

    createNotification: ['notification'], /// an object
    activateNotification: ['notificationId'],
    deactivateNotification: ['notificationId'],
    deleteNotification: ['notificationId']
  },
  { prefix: '@Notifications/' }
);

export { Types, Creators };
