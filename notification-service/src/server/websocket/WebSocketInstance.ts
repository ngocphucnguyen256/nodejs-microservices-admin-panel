import WebSocketManager from './WebSocketManager'

let websocket: WebSocketManager

export const createWebSocket = (server?: any) => {
  if (!websocket && server) {
    websocket = new WebSocketManager(server)
  }
  return websocket
}
