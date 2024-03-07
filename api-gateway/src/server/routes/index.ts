import { Express } from 'express'
import UsersRoutes from './UsersRoutes'
import ChatRoutes from './ChatRoutes'

const setupRoutes = (app: Express) => {
  UsersRoutes(app, '/api/v1/users-service')
  ChatRoutes(app, '/api/v1/chat-service')
}

export default setupRoutes
