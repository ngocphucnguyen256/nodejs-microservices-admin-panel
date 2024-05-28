import { Express } from 'express'
import ChatController from './controllers/chatController'
import { UserAuth } from './middlewares/UserAuth'
import { Channel } from 'amqplib'

const setupRoutes = (app: Express, channel: Channel) => {
  const chatController = new ChatController(channel)

  app.post('/chat-rooms', UserAuth, async (req, res, next) => {
    return chatController.createChatRoom(req, res, next)
  })
  app.get('/chat-rooms', UserAuth, async (req, res, next) => {
    return chatController.listChatRooms(req, res, next)
  })
  app.post('/messages', UserAuth, async (req, res, next) => {
    return chatController.sendMessage(req, res, next)
  })
  app.get('/chat-rooms/:id/messages', UserAuth, async (req, res, next) => {
    return chatController.listMessages(req, res, next)
  })
  app.get('/chat-rooms/:id/users', UserAuth, async (req, res, next) => {
    return chatController.getUsersInRoom(req, res, next)
  })
  app.get('/users', UserAuth, async (req, res, next) => {
    return chatController.getAllUsers(req, res, next)
  })
}

export default setupRoutes
