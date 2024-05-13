import { DataSourceOptions } from 'typeorm'
import Notification from '../db/entities/Notification'
import NotificationLog from '../db/entities/NotificationLog'
import Service from '../db/entities/Service'
import User from '../db/entities/User'
import { accessEnv } from '../utils'

const ormConfig: DataSourceOptions = {
  type: 'mysql', // Type of the database
  host: accessEnv('NOTIFICATION_SERVICE_DB_HOST', 'localhost'), // Database host
  port: parseInt(accessEnv('NOTIFICATION_SERVICE_DB_PORT', '3306')), // Database port
  username: accessEnv('NOTIFICATION_SERVICE_DB_USER', 'root'), // Database username
  password: accessEnv('NOTIFICATION_SERVICE_DB_PASSWORD', 'password'), // Database password
  database: accessEnv('NOTIFICATION_SERVICE_DB_NAME', 'db'), // Database name
  entities: [Notification, NotificationLog, Service, User], // Entities to be loaded for this connection
  synchronize: true, // Synchronize the database state with the entity definitions on startup
  logging: false // Enable logging
}

export default ormConfig
