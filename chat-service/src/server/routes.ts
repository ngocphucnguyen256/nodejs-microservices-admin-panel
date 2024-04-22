import { Express } from 'express'
import ChatController from './controllers/chatController'
import { UserAuth } from './middlewares/UserAuth'
import { Channel } from 'amqplib'

const setupRoutes = (app: Express, channel: Channel) => {
  const chatController = new ChatController(channel)

  app.post('/chat-rooms', UserAuth, chatController.createChatRoom)
  app.get('/chat-rooms', UserAuth, chatController.listChatRooms)
  app.post('/messages', UserAuth, chatController.sendMessage)
  app.get('/chat-rooms/:id/messages', UserAuth, chatController.listMessages)
}

export default setupRoutes
