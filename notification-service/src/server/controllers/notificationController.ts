import { Request, Response, NextFunction } from 'express'
import dayjs from 'dayjs'
import dataSource from '../../db/data-source'
import Notification from '../../db/entities/Notification'
import NotificationLog, { ChangeTypes } from '../../db/entities/NotificationLog'
import Service from '../../db/entities/Service'
import User from '../../db/entities/User'
import NotificationRepository from '../repository/notificationRepository'
import { generateUUID, SubscribeMessage } from '../../utils'
import { Channel } from 'amqplib'
import WebSocketManager from '../websocket/WebSocketManager'
import { In } from 'typeorm'
import { getWebSocketInstance } from '../websocket/WebSocketInstance'

const notificationRepository = dataSource.getRepository(Notification)
const notificationLogRepository = dataSource.getRepository(NotificationLog)
const userRepository = dataSource.getRepository(User)
const serviceRepository = dataSource.getRepository(Service)
const CustomNotificationRepository = new NotificationRepository()

export default class NotificationController {
  private channel: Channel
  private ws: WebSocketManager
  private routeKeys: Record<string, string>

  constructor(channel: Channel) {
    this.channel = channel
    this.ws = getWebSocketInstance()
    this.routeKeys = {
      USER_CREATED: 'USER_CREATED',
      USER_UPDATED: 'USER_UPDATED',
      USER_DELETED: 'USER_DELETED',
      CREATE_NOTIFICATION: 'CREATE_NOTIFICATION'
    }
    // To listen
    SubscribeMessage(channel, this)
  }
  async createNotification(req: Request, res: Response, next: NextFunction) {
    const reqUser = req.user
    let notification = new Notification()
    notification.id = generateUUID()
    notification.service = req.body.service
    notification.user = reqUser
    notification.payload = req.body.payload
    notification = await notificationRepository.save(notification)
    //send to websocket
    this.ws.sendNotification(notification, reqUser.id)
    return res.json(notification)
  }

  async listNotificationsByUser(req: Request, res: Response, next: NextFunction) {
    const notifications = await notificationRepository.find({
      where: {
        user: { id: req.user.id }
      }
    })
    return res.json(notifications)
  }

  async updateNotification(req: Request, res: Response, next: NextFunction) {
    let notification = await notificationRepository.findOneBy({ id: req.params.id })
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }
    if (req.body.status) notification.status = req.body.status
    if (req.body.payload) notification.payload = req.body.payload

    notification = await notificationRepository.save(notification)
    // const log = new NotificationLog()
    // log.notification = notification
    // log.changeType = ChangeTypes.UPDATE
    // await notificationLogRepository.save(log)
    return res.json(notification)
  }

  getRouteKeys = () => {
    return Object.values(this.routeKeys)
  }

  async SubscribeEvents(payload: any) {
    payload = JSON.parse(payload)
    const { routingKey, data } = payload

    switch (routingKey) {
      case 'USER_CREATED':
        console.log('User created event')
        //sync database
        userRepository.save(data)
        break
      case 'USER_UPDATED':
        console.log('User updated event')
        //sync database
        userRepository.save(data)
        break
      case 'USER_DELETED':
        console.log('User deleted event')
        //sync database
        userRepository.delete(data)
        break
      case 'CREATE_NOTIFICATION':
        {
          console.log('Received create Notification event !!!!!!!!!!!!!!!!')
          const { users, payload } = JSON.parse(data)
          if (!users || !payload) {
            return
          }

          const dbUsers = await userRepository.find({
            where: {
              id: In(users.map((user: User) => user.id))
            }
          })
          if (!dbUsers) {
            return
          }
          dbUsers.forEach(async (user: User) => {
            //service
            let service = new Service()
            service.name = routingKey
            service = await serviceRepository.save(service)
            //notification
            let notification = new Notification()
            notification.id = generateUUID()
            notification.user = user
            notification.payload = payload
            notification.service = service
            notification = await notificationRepository.save(notification)
            //send to websocket
            this.ws.sendNotification(notification, user.id)
          })
        }
        break
      default:
        break
    }
  }
}
