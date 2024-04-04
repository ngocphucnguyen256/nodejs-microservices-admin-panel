import bodyParser from 'body-parser'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import { createServer } from 'http'
import WebSocketManager from './websocket/WebSocketManager'
import { accessEnv } from '../utils'

import setupRoutes from './routes'

const PORT = parseInt(accessEnv('PORT', '7100'), 10)

const startServer = () => {
  const app = express()
  const server = createServer(app)

  app.use(bodyParser.json())

  app.use(
    cors({
      origin: (origin, cb) => cb(null, true),
      credentials: true
    })
  )

  setupRoutes(app)

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
