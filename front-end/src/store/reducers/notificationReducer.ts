import { Notification, Action } from '@/types';

const initialState : { 
    notifications: Notification[] 
} = {
    notifications: [],
};

const notificationReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case 'NOTIFICATION_MESSAGE_RECEIVED':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    case 'NOTIFICATION_SET_MESSAGES':
      return {
        ...state,
        notifications: action.payload,
      };
    case 'DELETED_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((notification) => notification.id !== action.payload),
      };
    default:
      return state;
  }
};

export default notificationReducer;
