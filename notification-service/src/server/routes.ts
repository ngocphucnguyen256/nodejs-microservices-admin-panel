import { Express } from 'express'
import NotificationController from './controllers/notificationController'
import { UserAuth } from './middlewares/UserAuth'
import { Channel } from 'amqplib'
import WebSocketManager from './websocket/WebSocketManager'

const setupRoutes = (app: Express, channel: Channel, ws: WebSocketManager) => {
  const notificationController = new NotificationController(channel, ws)

  app.post('/notifications', UserAuth, notificationController.createNotification)
  app.get('/notifications', UserAuth, notificationController.listNotificationsByUser)
}

export default setupRoutes
