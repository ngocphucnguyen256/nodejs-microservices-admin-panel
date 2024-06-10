// import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import setupRoutes, { chatWS, notificationWS } from './routes'
import accessEnv from '../helper/accessEnv'

const PORT = parseInt(accessEnv('PORT', '7000'))

const startServer = () => {
  const app = express()
  // app.use(express.json())
  // app.use(cookieParser())
  app.use(
    cors({
      origin: '*', // Allow all origins
      credentials: true // Accept credentials (cookies, authentication, etc.) from the request
    })
  )
  setupRoutes(app)

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('🚗 Hello from Job API Gateway!!!!!!!')
    console.info(`API gateway listening on ${PORT}`)
  })

  server.on('upgrade', function (req: any, socket: any, head) {
    if (req.url.indexOf('/api/ws/chat') === 0) {
      chatWS.upgrade(req, socket, head)
    }
  })
  server.on('upgrade', function (req: any, socket: any, head) {
    if (req.url.indexOf('/api/ws/notification') === 0) {
      notificationWS.upgrade(req, socket, head)
    }
  })
}

export default startServer
