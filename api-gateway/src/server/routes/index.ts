import { Express } from 'express'
import proxy from 'express-http-proxy'

import accessEnv from '../../helper/accessEnv'

const setupRoutes = (app: Express) => {
  app.use('/api/user', proxy(accessEnv('CUSTOMER_API_URL', 'http://users-service:7101')))
  app.use('/api/chat', proxy(accessEnv('CHAT_SERVICE_URL', 'http://chat-service:7100')))
}

export default setupRoutes
