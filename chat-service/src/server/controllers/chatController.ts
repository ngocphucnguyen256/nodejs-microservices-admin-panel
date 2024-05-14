import { Request, Response, NextFunction } from 'express'
import dayjs from 'dayjs'
import dataSource from '../../db/data-source'
import Message from '../../db/entities/Message'
import ChatRoom from '../../db/entities/ChatRoom'
import User from '../../db/entities/User'
import ChatRoomUser from '../../db/entities/ChatRoomUser'
import ChatRepository from '../repository/chatRepository'
import { generateUUID, SubscribeMessage, PublishMessage } from '../../utils'
import { Channel } from 'amqplib'

const messageRepository = dataSource.getRepository(Message)
const chatRoomRepository = dataSource.getRepository(ChatRoom)
const userRepository = dataSource.getRepository(User)
const chatRoomUserRepository = dataSource.getRepository(ChatRoomUser)

export default class ChatController {
  private channel: Channel
  private routeKeys: Record<string, string>
  private customChatRepository: ChatRepository

  constructor(channel: Channel) {
    this.channel = channel
    this.routeKeys = {
      USER_CREATED: 'USER_CREATED',
      USER_UPDATED: 'USER_UPDATED',
      USER_DELETED: 'USER_DELETED',
      CREATE_NOTIFICATION: 'CREATE_NOTIFICATION'
    }
    this.customChatRepository = new ChatRepository(channel)
    // To listen
    SubscribeMessage(channel, this)
  }
  async createChatRoom(req: Request, res: Response, next: NextFunction) {
    if (!req.body.name) {
      return res.status(400).json({ message: 'Name is required' })
    }

    const reqUser = req.user
    const chatRoom = new ChatRoom()
    chatRoom.id = generateUUID()
    chatRoom.name = req.body.name
    await chatRoomRepository.save(chatRoom).then((chatRoom) => {
      const chatRoomUser = new ChatRoomUser()
      chatRoomUser.id = generateUUID()
      chatRoomUser.chatRoom = chatRoom
      chatRoomUser.user = reqUser
      chatRoomUserRepository.save(chatRoomUser)
    })
    return res.json(chatRoom)
  }

  async listChatRooms(req: Request, res: Response, next: NextFunction) {
    const chatRooms = await chatRoomRepository.find()
    return res.json(chatRooms)
  }

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    const reqUser = req.user
    if (!reqUser) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const chatRoom = await chatRoomRepository.findOneBy({
      id: req.body.chatRoomId
    })
    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' })
    }
    const message = await this.customChatRepository.saveMessage(chatRoom, reqUser._id, req.body.content)
    return res.json(message)
  }

  async listMessages(req: Request, res: Response, next: NextFunction) {
    const messages = await messageRepository.find({
      where: {
        chatRoom: { id: req.params.id }
      }
    })
    return res.json(messages)
  }

  getRouteKeys() {
    return Object.values(this.routeKeys)
  }

  async SubscribeEvents(payload: any) {
    payload = JSON.parse(payload)
    const { routingKey, data } = payload

    switch (routingKey) {
      case 'USER_CREATED':
        console.log('User created event')
        //sync database
        userRepository.save(data)
        break
      case 'USER_UPDATED':
        console.log('User updated event')
        //sync database
        userRepository.save(data)
        break
      case 'USER_DELETED':
        console.log('User deleted event')
        //sync database
        userRepository.delete(data)
        break
      default:
        break
    }
  }
}
