import { DataSourceOptions } from 'typeorm';
import User from '../db/entities/User';
import UserSession from '../db/entities/UserSession';
import accessEnv from '../helper/accessEnv';


const ormConfig: DataSourceOptions = {
  type: 'mysql', // Type of the database
  host: accessEnv('USER_SERVICE_DB_HOST', 'localhost'), // Database host
  port: parseInt(accessEnv('USER_SERVICE_DB_PORT', '3306')), // Database port
  username: accessEnv('USER_SERVICE_DB_USER', 'root'), // Database username
  password: accessEnv('USER_SERVICE_DB_PASSWORD', 'password'), // Database password
  database: accessEnv('USER_SERVICE_DB_NAME', 'db'), // Database name
  entities: [User, UserSession], // Entities to be loaded for this connection
  synchronize: true, // Synchronize the database state with the entity definitions on startup
  logging: false, // Enable logging
};

export default ormConfig;