import { Express } from 'express'
import { createChatRoom, listChatRooms, sendMessage, listMessages } from './controllers/chatController'
import { UserAuth } from './middlewares/UserAuth'

const setupRoutes = (app: Express) => {
  app.post('/chat-rooms', UserAuth, createChatRoom)
  app.get('/chat-rooms', listChatRooms)
  app.post('/messages', UserAuth, sendMessage)
  app.get('/chat-rooms/:id/messages', listMessages)
}

export default setupRoutes
