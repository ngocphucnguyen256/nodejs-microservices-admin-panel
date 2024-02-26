import { DataSourceOptions } from 'typeorm';
import User from '../db/entities/User';

require('dotenv').config()

const ormConfig: DataSourceOptions = {
  type: 'mysql', // Type of the database
  host: process.env.USER_SERVICE_DB_HOST, // Database host
  port: parseInt(process.env.USER_SERVICE_DB_PORT || '3306'), // Database port
  username: process.env.USER_SERVICE_DB_USER, // Database username
  password: process.env.USER_SERVICE_DB_PASSWORD, // Database password
  database: process.env.USER_SERVICE_DB_NAME, // Database name
  entities: [User], // Entities to be loaded for this connection
  synchronize: true, // Synchronize the database state with the entity definitions on startup
  logging: false, // Enable logging
};

export default ormConfig;