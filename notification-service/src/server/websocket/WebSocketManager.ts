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
      console.log('connected')
      ws.on('message', (message) => {
        console.log('message received: ', message.toString())
        const { token, type, content } = JSON.parse(message.toString())

        if (!token) {
          ws.send(JSON.stringify({ error: 'No token provided' }))
          return
        }

        // Verify the JWT token
        const decoded = jwt.verify(token, accessEnv('JWT_SECRET', 'secret'))
        const payload = decoded as { _id: string }

        if (type === 'CONNECT') {
          if (!this.socketClients[payload._id]) {
            this.socketClients[payload._id] = new Set()
          }
          this.socketClients[payload._id].add(ws)
          console.log(`Client connected: ${payload._id}`)
          return
        }
      })

      ws.on('close', () => {
        console.log('WebSocket connection closed')
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
    console.log('Sending notification to user:', userId)
    if (!this.socketClients[userId]) {
      console.log('No connected clients for user:', userId)
      return
    }
    this.socketClients[userId].forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        console.log('sent notification via websocket')
        client.send(JSON.stringify(notification))
      }
    })
  }
}

export default WebSocketManager
