import bodyParser from 'body-parser'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import { createServer } from 'http'
import { accessEnv, CreateChannel } from '../utils'
import { createWebSocket } from './websocket/WebSocketInstance'

import setupRoutes from './routes'

const PORT = parseInt(accessEnv('PORT', '7102'), 10)

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

  setupRoutes(app, channel)

  //log incoming requests
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.info(`${req.method} ${req.path}`)
    next()
  })

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    return res.status(500).json({ message: err.message })
  })

  server.listen(PORT, '0.0.0.0', () => {
    console.info(`Notification service listening on ${PORT}`)
    // WebSocket setup
    createWebSocket(server)
  })
}

export default startServer
