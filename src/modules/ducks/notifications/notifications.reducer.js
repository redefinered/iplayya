import { createReducer } from 'reduxsauce';
import { Types } from './notifications.actions';
import {
  deactivateNotificationById,
  activateNotificationById,
  // setNotificationToUnreadById,
  updateNotificationStatus
} from './notifications.helpers';

const INITIAL_STATE = {
  notifications: [], // notifications delivered

  notificationService: null,

  notification: null,
  token: null,

  selectedForDeactivation: null,

  readNotifications: []
};

export default createReducer(INITIAL_STATE, {
  // this sets the notification service that will be used app-wide
  [Types.SET_NOTIFICATION_SERVICE]: (state, { service: notificationService }) => ({
    ...state,
    notificationService
  }),

  // sets the new notification
  [Types.ON_NOTIF]: (state, { notification }) => ({
    ...state,
    notification
  }),

  [Types.ON_REGISTER]: (state, { token }) => ({ ...state, token }),

  [Types.MARK_NOTIFICATION_AS_READ]: (state, action) => ({
    ...state,
    readNotifications: [action.notification, ...state.readNotifications]
  }),

  [Types.CLEAR_NOTIFICATIONS]: (state) => ({ ...state, readNotifications: [] }),

  [Types.ON_NOTIF_RESET]: (state) => {
    return { ...state, notification: null };
  },

  // [Types.ON_NOTIF]: (state, action) => {
  //   const notifications = setNotificationToUnreadById(state, action);

  //   return {
  //     ...state,
  //     notification: action.notification,
  //     notifications
  //   };
  // },
  // [Types.ON_REGISTER]: (state, action) => {
  //   return { ...state, token: action.token };
  // },

  /// actions from this point might all become useless moving forward
  [Types.CREATE_NOTIFICATION]: (state, action) => {
    return {
      ...state,
      notifications: [action.notification, ...state.notifications]
    };
  },

  [Types.ACTIVATE_NOTIFICATION]: (state, action) => {
    const notifications = activateNotificationById(state, action);

    return { ...state, notifications };
  },
  [Types.DEACTIVATE_NOTIFICATION]: (state, action) => {
    const notifications = deactivateNotificationById(state, action);

    return { ...state, notifications };
  },
  [Types.DELETE_NOTIFICATION]: (state, action) => {
    const updatedNotifs = state.notifications.filter(({ id }) => id !== action.notificationId);
    return { ...state, notifications: updatedNotifs };
  },
  [Types.UPDATE_NOTIFICATION_STATUS]: (state, action) => {
    const notifications = updateNotificationStatus(state, action);

    return { ...state, notifications };
  },

  [Types.SET_SELECTED_FOR_DEACTIVATION]: (state, action) => {
    return { ...state, selectedForDeactivation: action.notificationId };
  },
  [Types.CLEAR_SELECTED_FOR_DEACTIVATION]: (state) => {
    return { ...state, selectedForDeactivation: null };
  }
});
