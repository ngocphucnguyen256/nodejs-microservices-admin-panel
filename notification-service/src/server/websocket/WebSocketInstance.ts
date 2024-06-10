import WebSocketManager from './WebSocketManager'

let websocket: WebSocketManager

export const createWebSocket = (server?: any) => {
  if (!websocket && server) {
    websocket = new WebSocketManager(server)
  }
  return websocket
}

export const getWebSocketInstance = () => {
  if (!websocket) {
    throw new Error('WebSocketManager instance has not been created. Call createWebSocket(server) first.')
  }
  return websocket
}
