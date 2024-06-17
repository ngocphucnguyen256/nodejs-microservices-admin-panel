import { Express } from 'express'
import ChatController from './controllers/chatController'
import { UserAuth } from './middlewares/UserAuth'
import { Channel } from 'amqplib'

const setupRoutes = (app: Express, channel: Channel) => {
  const chatController = new ChatController(channel)

  app.post('/chat-rooms', UserAuth, async (req, res, next) => {
    // #swagger.tags = ['ChatRoom']
    // #swagger.description = 'Create a chat room'
    return chatController.createChatRoom(req, res, next)
  })
  app.get('/chat-rooms', UserAuth, async (req, res, next) => {
    // #swagger.tags = ['ChatRoom']
    // #swagger.description = 'List all chat rooms'
    return chatController.listChatRooms(req, res, next)
  })

  app.get('/chat-rooms/:id/users', UserAuth, async (req, res, next) => {
    // #swagger.tags = ['ChatRoom']
    // #swagger.description = 'List all users in a chat room'
    return chatController.getUsersInRoom(req, res, next)
  })
  app.delete('/chat-rooms/:id/users/:userId', UserAuth, async (req, res, next) => {
    // #swagger.tags = ['ChatRoom']
    // #swagger.description = 'Delete a user from a chat room'
    return chatController.deleteUserFromRoom(req, res, next)
  })
  app.post('/chat-rooms/:id/users', UserAuth, async (req, res, next) => {
    // #swagger.tags = ['ChatRoom']
    // #swagger.description = 'Add a user to a chat room'
    return chatController.addUserToRoom(req, res, next)
  })

  app.post('/messages', UserAuth, async (req, res, next) => {
    // #swagger.tags = ['Message']
    // #swagger.description = 'Send a message to a chat room'
    return chatController.sendMessage(req, res, next)
  })
  app.delete('/messages/:id', UserAuth, async (req, res, next) => {
    // #swagger.tags = ['Message']
    // #swagger.description = 'Delete a message from a chat room'
    return chatController.deleteMessage(req, res, next)
  })
  app.get('/chat-rooms/:id/messages', UserAuth, async (req, res, next) => {
    // #swagger.tags = ['Message']
    // #swagger.description = 'List all messages in a chat room'
    return chatController.listMessages(req, res, next)
  })
  app.get('/users', UserAuth, async (req, res, next) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'List all users'
    return chatController.getAllUsers(req, res, next)
  })
}

export default setupRoutes
