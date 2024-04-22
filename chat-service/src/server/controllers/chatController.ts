import { Request, Response } from 'express'
import dayjs from 'dayjs'
import dataSource from '../../db/data-source'
import Message from '../../db/entities/Message'
import ChatRoom from '../../db/entities/ChatRoom'
import User from '../../db/entities/User'
import ChatRepository from '../repository/chatRepository'
import { generateUUID, SubscribeMessage } from '../../utils'
import { Channel } from 'amqplib'

const messageRepository = dataSource.getRepository(Message)
const chatRoomRepository = dataSource.getRepository(ChatRoom)
const userRepository = dataSource.getRepository(User)
const chatRepository = new ChatRepository()

export default class ChatController {
  private channel: Channel

  constructor(channel: Channel) {
    this.channel = channel
    // To listen
    SubscribeMessage(channel, this)
  }
  async createChatRoom(req: Request, res: Response) {
    const reqUser = req.user
    let chatRoom = new ChatRoom()
    chatRoom.id = generateUUID()
    chatRoom.name = req.body.name
    chatRoom = await chatRoomRepository.save(chatRoom)
    return res.json(chatRoom)
  }

  async listChatRooms(req: Request, res: Response) {
    const chatRooms = await chatRoomRepository.find()
    return res.json(chatRooms)
  }

  async sendMessage(req: Request, res: Response) {
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
    const message = await chatRepository.saveMessage(chatRoom, reqUser._id, req.body.content)
    return res.json(message)
  }

  async listMessages(req: Request, res: Response) {
    const messages = await messageRepository.find({
      where: {
        chatRoom: { id: req.params.id }
      }
    })
    return res.json(messages)
  }

  getRouteKeys = () => {
    return ['USER_CREATED', 'USER_UPDATED', 'USER_DELETED']
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
      default:
        break
    }
  }
}
