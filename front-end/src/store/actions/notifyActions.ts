import { Notification } from '../../types/index'
import { concatApiWebsocketUrl } from '../../utils/index';


export const NOTIFICATION_WEBSOCKET_CONNECT = 'NOTIFICATION_WEBSOCKET_CONNECT';
export const NOTIFICATION_WEBSOCKET_DISCONNECT = 'NOTIFICATION_WEBSOCKET_DISCONNECT';
export const NOTIFICATION_WEBSOCKET_SEND_MESSAGE = 'NOTIFICATION_WEBSOCKET_SEND_MESSAGE';
export const NOTIFICATION_MESSAGE_RECEIVED = 'NOTIFICATION_MESSAGE_RECEIVED';
export const NOTIFICATION_SET_MESSAGES = 'NOTIFICATION_SET_MESSAGES';

const wsUrl = concatApiWebsocketUrl('ws/notification')
// const wsUrl = 'ws://localhost:7102/' 

export const connectWebSocketNotification = () => ({
  type: NOTIFICATION_WEBSOCKET_CONNECT,
  payload: { wsUrl }
});

export const disconnectWebSocket = () => ({
type: NOTIFICATION_WEBSOCKET_DISCONNECT
});

export const messageReceived = (notification: Notification) => ({
  type: NOTIFICATION_MESSAGE_RECEIVED,
  payload: notification
});


export const sendJoinMessage = (token : string) => ({
  type: NOTIFICATION_WEBSOCKET_SEND_MESSAGE,
  payload : {
    token,
    type: "CONNECT",
  }
});
