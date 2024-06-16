// middleware/websocket/notificationSocket.ts
import { Middleware, MiddlewareAPI } from 'redux';
import {
  NOTIFICATION_WEBSOCKET_CONNECT,
  NOTIFICATION_WEBSOCKET_DISCONNECT,
  NOTIFICATION_WEBSOCKET_SEND_MESSAGE,
  NOTIFICATION_MESSAGE_RECEIVED
} from '@/store/actions/notifyActions';
import {
  CHAT_WEBSOCKET_CONNECT,
  CHAT_WEBSOCKET_DISCONNECT,
  CHAT_WEBSOCKET_SEND_MESSAGE,
  CHAT_MESSAGE_RECEIVED
} from '@/store/actions/chatActions';
import { PayloadAction, Notification } from '@/types';

const websocketMiddlewareNotification = (): Middleware => {
  let socketMap: Map<string, WebSocket> = new Map();

  const onMessageNotification = (store: MiddlewareAPI) => (event: MessageEvent) => {
    const message = JSON.parse(event.data) as Notification
    console.log("Notification message received:", message);
    store.dispatch({ type: NOTIFICATION_MESSAGE_RECEIVED, payload: message });
  };

  const onMessage = (store: MiddlewareAPI) => (event: MessageEvent) => {
    const message = JSON.parse(event.data);
    console.log("Chat message received:", message);
    store.dispatch({ type: CHAT_MESSAGE_RECEIVED, payload: message });
  };


  return store => next => (action: unknown) => {
    const payloadAction = action as PayloadAction;
    // console.log(action);
    let socketNotification = socketMap.get('NOTIFICATION_WEBSOCKET') || null;
    let socketChat = socketMap.get('CHAT_WEBSOCKET') || null;
    let retryCount = 0;
    let interval: NodeJS.Timeout;
    switch (payloadAction.type) {
      //NOTIFICATION WEBSOCKET
      case NOTIFICATION_WEBSOCKET_CONNECT:
        if (socketNotification !== null) {
          socketNotification.close();
        }
        socketNotification = new WebSocket(payloadAction.payload.wsUrl);
        socketMap.set('NOTIFICATION_WEBSOCKET', socketNotification);
        socketNotification.onmessage = onMessageNotification(store);
        break;
      case NOTIFICATION_WEBSOCKET_DISCONNECT:
        if (socketNotification !== null) {
          socketNotification.close();
        }
        socketNotification = null;
        break;
      case NOTIFICATION_WEBSOCKET_SEND_MESSAGE:
        if (socketNotification && socketNotification.readyState === WebSocket.OPEN) {
          socketNotification.send(JSON.stringify(payloadAction.payload));
          console.log("Notification message sent:", payloadAction.payload);
        } else {
          console.log("Notification socket not connected, message not sent");
          interval = setTimeout(() => {
            retryCount++;
            store.dispatch({ type: NOTIFICATION_WEBSOCKET_SEND_MESSAGE, payload: payloadAction.payload });
          }, 2000);
          if (retryCount >= 5) {
            clearTimeout(interval);
          }
        }
        break;

      //CHAT WEBSOCKET
      case CHAT_WEBSOCKET_CONNECT:
        if (socketChat !== null) {
          socketChat.close();
        }
        socketChat = new WebSocket(payloadAction.payload.wsUrl);
        socketMap.set('CHAT_WEBSOCKET', socketChat);
        socketChat.onmessage = onMessage(store);
        break;
      case CHAT_WEBSOCKET_DISCONNECT:
        if (socketChat !== null) {
          socketChat.close();
        }
        socketChat = null;
        break;
      case CHAT_WEBSOCKET_SEND_MESSAGE:
        if (socketChat && socketChat.readyState === WebSocket.OPEN) {
          socketChat.send(JSON.stringify(payloadAction.payload));
          console.log("Chat message sent:", payloadAction.payload);
        } else {
          console.log("Chat socket not connected, message not sent", socketMap);
        }
        break;
      default:
        return next(action);
    }
  };
};

export default websocketMiddlewareNotification;
