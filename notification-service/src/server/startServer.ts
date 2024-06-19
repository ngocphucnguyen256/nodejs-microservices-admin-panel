import bodyParser from 'body-parser'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import { createServer } from 'http'
import { accessEnv, CreateChannel } from '../utils'
import { createWebSocket, getWebSocketInstance } from './websocket/WebSocketInstance'

import setupRoutes from './routes'

//swagger
import swaggerUi from 'swagger-ui-express'
import swaggerFile from './swagger_output.json'

//logger
import loggerManager from '../logger/loggerManager'

const PORT = parseInt(accessEnv('PORT', '7102'), 10)

const startServer = async () => {
  const app = express()
  const server = createServer(app)

  const logger = loggerManager.getLogger('notification-service', 'error')

  app.use(bodyParser.json())

  // app.use(
  //   cors({
  //     origin: (origin, cb) => cb(null, true),
  //     credentials: true
  //   })
  // )

  app.use(
    cors({
      origin: '*', // Allow all origins
      credentials: true // Accept credentials (cookies, authentication, etc.) from the request
    })
  )

  // WebSocket setup
  createWebSocket(server)

  const channel = await CreateChannel()

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

  setupRoutes(app, channel)

  //log incoming requests
  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.path}`)
    next()
  })

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message)
    return res.status(500).json({ message: err.message })
  })

  server.listen(PORT, '0.0.0.0', () => {
    if (getWebSocketInstance().wss) {
      logger.info('WebSocket server is running')
    } else {
      logger.error('WebSocket server is not running')
    }
    logger.info(`Notification service listening on ${PORT}`)
  })
}

export default startServer
