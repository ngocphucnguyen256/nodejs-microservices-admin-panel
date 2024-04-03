import { DataSourceOptions } from 'typeorm'
import Message from '../db/entities/Message'
import ChatRoom from '../db/entities/ChatRoom'
import ChatRoomUser from '../db/entities/ChatRoomUser'

import { accessEnv } from '../utils'

const ormConfig: DataSourceOptions = {
  type: 'mysql', // Type of the database
  host: accessEnv('CHAT_SERVICE_DB_HOST', 'localhost'), // Database host
  port: parseInt(accessEnv('CHAT_SERVICE_DB_PORT', '3306')), // Database port
  username: accessEnv('CHAT_SERVICE_DB_USER', 'root'), // Database username
  password: accessEnv('CHAT_SERVICE_DB_PASSWORD', 'password'), // Database password
  database: accessEnv('CHAT_SERVICE_DB_NAME', 'db'), // Database name
  entities: [Message, ChatRoom, ChatRoomUser], // Entities to be loaded for this connection
  synchronize: true, // Synchronize the database state with the entity definitions on startup
  logging: false // Enable logging
}

export default ormConfig
