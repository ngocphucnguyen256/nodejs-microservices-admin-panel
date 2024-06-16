import { Message } from '../../types/index'
import {  concatApiWebsocketUrl } from '../../utils/index';
import store from '@/store';

export const CHAT_WEBSOCKET_CONNECT = 'CHAT_WEBSOCKET_CONNECT';
export const CHAT_WEBSOCKET_DISCONNECT = 'CHAT_WEBSOCKET_DISCONNECT';
export const CHAT_WEBSOCKET_SEND_MESSAGE = 'CHAT_WEBSOCKET_SEND_MESSAGE';
export const CHAT_MESSAGE_RECEIVED = 'CHAT_MESSAGE_RECEIVED';
export const CHAT_SET_MESSAGES = 'CHAT_SET_MESSAGES';

const wsUrl = concatApiWebsocketUrl('ws/chat')

export const connectChatWebSocket = () => ({
    type: CHAT_WEBSOCKET_CONNECT,
    payload: { wsUrl }
  });
  
export const disconnectChatWebSocket = () => ({
  type: CHAT_WEBSOCKET_DISCONNECT
});

let token = "";
if(store.getState().auth.user && store.getState().auth.user.token){
  token = store.getState().auth.user.token;
}

export const sendMessage = (content: string, roomId : string) => ({
  type: CHAT_WEBSOCKET_SEND_MESSAGE,
  payload: {
    type: "MESSAGE",
    token,
    content: content,
    roomId: roomId,
  }
});

export const deleteMessage = (messageId : string, roomId: string) => ({
  type: CHAT_WEBSOCKET_SEND_MESSAGE,
  payload: {
    type: "DELETE_MESSAGE",
    token,
    messageId: messageId,
    roomId: roomId,
  }
});


export const sendJoinRoomMessage = (roomId : string) => ({
  type: CHAT_WEBSOCKET_SEND_MESSAGE,
  payload : {
    token,
    type: "JOIN",
    roomId,
  }
});

export const sendRegisterNotificationMessage = () => ({
  type: CHAT_WEBSOCKET_SEND_MESSAGE,
  payload : {
    token,
    type: "REGISTER_NOTIFICATION",
  }
});

export const messageReceived = (message: Message) => ({
  type: CHAT_SET_MESSAGES,
  payload: message
});
