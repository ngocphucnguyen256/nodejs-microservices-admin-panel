import WebSocket from 'ws'
import { Server } from 'http'

import dataSource from '../../db/data-source'
import Notification from '../../db/entities/Notification'
import { accessEnv } from '../../utils'
import jwt from 'jsonwebtoken'

const messageRepository = dataSource.getRepository(Notification)
const notificationRepository = dataSource.getRepository(Notification)

class WebSocketManager {
  wss: WebSocket.Server
  socketClients: Record<string, Set<WebSocket>>

  constructor(server: Server) {
    this.wss = new WebSocket.Server({ server })
    this.socketClients = {}
    this.initialize()
  }

  initialize() {
    this.wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        const { token, type, content } = JSON.parse(message.toString())

        if (!token) {
          ws.send(JSON.stringify({ error: 'No token provided' }))
          return
        }

        // Verify the JWT token
        const decoded = jwt.verify(token, accessEnv('JWT_SECRET', 'secret'))
        const payload = decoded as { _id: string }

        if (type === 'CONNECT') {
          this.socketClients[payload._id].add(ws)
          return
        }
      })

      ws.on('close', () => {
        Object.keys(this.socketClients).forEach((key) => {
          this.socketClients[key].delete(ws)
          if (this.socketClients[key].size === 0) {
            delete this.socketClients[key]
          }
        })
      })

      ws.on('error', (err) => {
        console.log('error', err)
      })
    })
  }

  sendNotification(notification: Notification, userId: string) {
    if (!this.socketClients[userId]) {
      return
    }
    this.socketClients[userId].forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ notification, userId }))
      }
    })
  }
}

export default WebSocketManager
