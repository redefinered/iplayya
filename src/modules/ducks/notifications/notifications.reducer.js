import { createReducer } from 'reduxsauce';
import { Types } from './notifications.actions';
import { deactivateNotificationById, activateNotificationById } from './notifications.helpers';

const INITIAL_STATE = {
  notifications: [], // notifications delivered
  token: null
};

export default createReducer(INITIAL_STATE, {
  [Types.ON_NOTIF]: (state, action) => {
    return {
      ...state,
      notifications: [
        Object.assign(action.notification, {
          read: false,
          createdAt: new Date(Date.now()).getTime()
        }),
        ...state.notifications
      ]
    };
  },
  [Types.ON_REGISTER]: (state, action) => {
    return { ...state, token: action.token };
  },

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
  }
});
