import WebSocket from 'ws'
import { Server } from 'http'

import dataSource from '../../db/data-source'
import Message from '../../db/entities/Message'
import ChatRepository from '../repository/chatRepository'
import { accessEnv, CreateChannel } from '../../utils'
import jwt from 'jsonwebtoken'
import { Channel } from 'amqplib'
import loggerManager from '@/logger/loggerManager'

const logger = loggerManager.getLogger('chat-service', 'error')

const messageRepository = dataSource.getRepository(Message)

class WebSocketManager {
  wss: WebSocket.Server
  rooms: Record<string, Set<WebSocket>>
  channel: Channel
  customChatRepository: ChatRepository
  registerNotificationUsers: Set<{
    userId: string
    ws: WebSocket
  }>

  constructor(server: Server) {
    this.wss = new WebSocket.Server({ server })
    this.rooms = {} // Object to manage rooms and their participants
    this.registerNotificationUsers = new Set()
    this.initializeChannelAndRepository()
    this.initialize()
  }

  async initializeChannelAndRepository() {
    this.channel = await CreateChannel()
    this.customChatRepository = new ChatRepository(this.channel)
  }

  initialize() {
    this.wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        const { token, type, roomId, content, messageId } = JSON.parse(message.toString())

        if (!token) {
          ws.send(JSON.stringify({ error: 'No token provided' }))
          return
        }

        // Verify the JWT token
        const decoded = jwt.verify(token, accessEnv('JWT_SECRET', 'secret'))
        const payload = decoded as { _id: string }

        if (type === 'REGISTER_NOTIFICATION') {
          this.registerNotificationUsers.add({ userId: payload._id, ws })
          return
        }

        if (!roomId) {
          ws.send(JSON.stringify({ error: 'No room provided' }))
          return
        }

        if (type === 'JOIN') {
          if (!this.rooms[roomId]) {
            this.rooms[roomId] = new Set()
          }
          this.rooms[roomId].add(ws)
          console.log('joined room', roomId, 'with', this.rooms[roomId].size, 'participants')
          //add to chat room users
          this.customChatRepository.addUserToChatRoom(roomId, payload._id)
          return
        }

        if (type === 'MESSAGE' && this.rooms[roomId]) {
          //save the message to the database
          console.log('Message:', content)
          this.customChatRepository
            .saveMessage(roomId, payload._id, content)
            .then((message) => {
              console.log('message saved to db')
              //send the message to room participants
              this.rooms[roomId].forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify(message))
                }
              })
              //send the message to notification users
              const chatRoomUsers = this.customChatRepository.getUsersInChatRoom(roomId)
              chatRoomUsers.then((users) => {
                users.forEach((user) => {
                  this.registerNotificationUsers.forEach((registerUser) => {
                    if (registerUser.userId === user.id) {
                      registerUser.ws.send(JSON.stringify(message))
                    }
                  })
                })
              })
            })
            .catch((err) => {
              console.log('error saving message:', err)
            })
        }
        if (type === 'DELETE_MESSAGE' && this.rooms[roomId]) {
          //save the message to the database
          this.customChatRepository
            .deleteMessage(messageId, payload._id)
            .then((message) => {
              console.log('message deleted from db:', messageId)
              //send delete notification to room participants
              this.rooms[roomId].forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(
                    JSON.stringify({
                      type: 'DELETED_MESSAGE',
                      messageId
                    })
                  )
                }
              })
            })
            .catch((err) => {
              console.log('error delete message:', err)
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
        logger.error('error', err)
      })
    })
  }
}

export default WebSocketManager
