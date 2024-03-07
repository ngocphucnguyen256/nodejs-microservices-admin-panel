import { Express } from 'express'

import { createChatRoom, listChatRooms, sendMessage, listMessages } from '../controllers/chatController'

export default function ChatRoutes(app: Express, prefix: string = '') {
  app.post(`${prefix}/chat-rooms`, createChatRoom)
  app.get(`${prefix}/chat-rooms`, listChatRooms)
  app.post(`${prefix}/messages`, sendMessage)
  app.get(`${prefix}/chat-rooms/:id/messages`, listMessages)
}
