import { Express } from 'express'
import { createChatRoom, listChatRooms, sendMessage, listMessages } from './controllers/chatController'

const setupRoutes = (app: Express) => {
  app.post('/chat-rooms', createChatRoom)
  app.get('/chat-rooms', listChatRooms)
  app.post('/messages', sendMessage)
  app.get('/chat-rooms/:id/messages', listMessages)
}

export default setupRoutes
