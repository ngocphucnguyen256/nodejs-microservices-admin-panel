import dataSource from '../../db/data-source'
import Notification from '../../db/entities/Notification'
import NotificationLog from '../../db/entities/NotificationLog'
import User from '../../db/entities/User'
import { Repository, DataSource } from 'typeorm'
import { generateUUID } from '../../utils'
import dayjs from 'dayjs'

export default class NotificationRepository {
  private notificationRepository: Repository<Notification>
  private notificationLogRepository: Repository<NotificationLog>
  private dataSource: DataSource

  constructor() {
    this.notificationRepository = dataSource.getRepository(Notification)
    this.notificationLogRepository = dataSource.getRepository(NotificationLog)
    this.dataSource = dataSource
  }
}
