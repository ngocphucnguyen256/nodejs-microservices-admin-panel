import { Express } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'

import accessEnv from '../../helper/accessEnv'

export const chatWS = createProxyMiddleware({
  target: accessEnv('CHAT_SERVICE_WS_URL', 'ws://chat-service:7100'),
  changeOrigin: true,
  ws: true
})
export const notificationWS = createProxyMiddleware({
  target: accessEnv('NOTIFICATION_SERVICE_WS_URL', 'ws://notification-service:7102'),
  changeOrigin: true,
  ws: true
})

const setupRoutes = (app: Express) => {
  // Regular HTTP proxy
  app.use(
    '/api/user',
    createProxyMiddleware({
      target: accessEnv('USERS_SERVICE_URL', 'http://users-service:7101'),
      changeOrigin: true
    })
  )

  // WebSocket proxy for the chat service
  app.use('/api/ws/chat', chatWS)

  app.use(
    '/api/chat',
    createProxyMiddleware({
      target: accessEnv('CHAT_SERVICE_URL', 'http://chat-service:7100'),
      changeOrigin: true
    })
  )

  // WebSocket proxy for the notification service
  app.use('/api/ws/notification', notificationWS)

  app.use(
    '/api/notification',
    createProxyMiddleware({
      target: accessEnv('NOTIFICATION_SERVICE_URL', 'http://notification-service:7102'),
      changeOrigin: true
    })
  )
}

export default setupRoutes
