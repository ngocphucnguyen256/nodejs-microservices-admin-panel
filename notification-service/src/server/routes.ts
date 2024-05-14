import { Express } from 'express'
import NotificationController from './controllers/notificationController'
import { UserAuth } from './middlewares/UserAuth'
import { Channel } from 'amqplib'

const setupRoutes = (app: Express, channel: Channel) => {
  const notificationController = new NotificationController(channel)

  app.post('/notifications', UserAuth, async (req, res, next) => {
    return notificationController.createNotification(req, res, next)
  })
  app.get('/notifications', UserAuth, async (req, res, next) => {
    return notificationController.listNotificationsByUser(req, res, next)
  })
}

export default setupRoutes
