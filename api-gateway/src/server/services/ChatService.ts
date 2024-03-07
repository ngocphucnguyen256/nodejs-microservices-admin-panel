import { Request, Response, NextFunction } from 'express'
import got from 'got'
import accessEnv from '../../helper/accessEnv'
import User from './UsersService'

export interface ChatRoom {
  id: string
  name: string
  users: User[]
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  status: string
  sender: User
  chatRoom: ChatRoom
  content: string
  createdAt: string
  updatedAt: string
}

export default class ChatService {
  private static chatServiceUrl = accessEnv('CHAT_SERVICE_URL', 'http://chat-service:7100')

  public static async createChatRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await got
        .post(`${this.chatServiceUrl}/chat-rooms`, {
          json: req.body
        })
        .json()
      if (!response) return null
      return response
    } catch (error: any) {
      console.error('Error creating chat room', error.response.body)
      throw error
    }
  }

  public static async listChatRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await got.get(`${this.chatServiceUrl}/chat-rooms`).json()
      if (!response) return null
      return response
    } catch (error: any) {
      console.error('Error get list chat room', error.response.body)
      throw error
    }
  }

  public static async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await got.post(`${this.chatServiceUrl}/messages`, {
        json: req.body
      })
      if (!response) return null
      return response
    } catch (error: any) {
      console.error('Error creating chat room', error.response.body)
      throw error
    }
  }

  public static async listMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await got.get(`${this.chatServiceUrl}/chat-rooms/${req.params.id}/messages`).json()
      if (!response) return null
      return response
    } catch (error: any) {
      console.error('Error creating chat room', error.response.body)
      throw error
    }
  }
}
