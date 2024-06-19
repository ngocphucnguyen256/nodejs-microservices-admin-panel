import bodyParser from 'body-parser'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import { createServer } from 'http'
import WebSocketManager from './websocket/WebSocketManager'
import { accessEnv, CreateChannel } from '../utils'
import setupRoutes from './routes'
import 'reflect-metadata'

//swagger
import swaggerUi from 'swagger-ui-express'
import swaggerFile from './swagger_output.json'

const PORT = parseInt(accessEnv('PORT', '7100'), 10)

const startServer = async () => {
  const app = express()

  const server = createServer(app)

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

  const channel = await CreateChannel()

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

  setupRoutes(app, channel)

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    return res.status(500).json({ message: err.message })
  })

  server.listen(PORT, '0.0.0.0', () => {
    console.info(`Chat service listening on ${PORT}`)
    // WebSocket setup
    new WebSocketManager(server)
  })
}

export default startServer
