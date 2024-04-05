import WebSocket from 'ws'
import { Server } from 'http'

import dataSource from '../../db/data-source'
import Message from '../../db/entities/Message'
import ChatRepository from '../repository/chatRepository'
import { accessEnv } from '../../utils'
import jwt from 'jsonwebtoken'

const messageRepository = dataSource.getRepository(Message)
const chatRepository = new ChatRepository()

class WebSocketManager {
  wss: WebSocket.Server
  rooms: Record<string, Set<WebSocket>>

  constructor(server: Server) {
    this.wss = new WebSocket.Server({ server })
    this.rooms = {} // Object to manage rooms and their participants
    this.initialize()
  }

  initialize() {
    this.wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        const { token, type, roomId, content } = JSON.parse(message.toString())

        if (!token) {
          ws.send(JSON.stringify({ error: 'No token provided' }))
          return
        }

        if (!roomId) {
          ws.send(JSON.stringify({ error: 'No room provided' }))
          return
        }

        // Verify the JWT token
        const decoded = jwt.verify(token, accessEnv('JWT_SECRET', 'secret'))
        const payload = decoded as { _id: string }

        if (type === 'JOIN') {
          if (!this.rooms[roomId]) {
            this.rooms[roomId] = new Set()
          }
          this.rooms[roomId].add(ws)
          console.log('joined room', roomId, 'with', this.rooms[roomId].size, 'participants')
          return
        }

        if (type === 'MESSAGE' && this.rooms[roomId]) {
          //save the message to the database
          console.log('Message:', content)
          chatRepository
            .saveMessage(roomId, payload._id, content)
            .then((message) => {
              console.log('message saved to db')
              this.rooms[roomId].forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  //send the message to the client
                  client.send(JSON.stringify({ roomId, content, senderId: payload._id }))
                }
              })
            })
            .catch((err) => {
              console.log('error saving message:', err)
            })
        }
      })

      ws.on('close', () => {
        Object.keys(this.rooms).forEach((roomId) => {
          this.rooms[roomId].delete(ws)
          if (this.rooms[roomId].size === 0) {
            delete this.rooms[roomId]
          }
        })
      })

      ws.on('error', (err) => {
        console.log('error', err)
      })
    })
  }
}

export default WebSocketManager
