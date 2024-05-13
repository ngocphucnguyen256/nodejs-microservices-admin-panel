import dataSource from '../../db/data-source'
import Message from '../../db/entities/Message'
import ChatRoom from '../../db/entities/ChatRoom'
import User from '../../db/entities/User'
import ChatRoomUser from '../../db/entities/ChatRoomUser'
import { Repository, DataSource } from 'typeorm'
import { generateUUID } from '../../utils'
import dayjs from 'dayjs'

export default class ChatRepository {
  private messageRepository: Repository<Message>
  private chatRoomRepository: Repository<ChatRoom>
  private chatRoomUserRepository: Repository<ChatRoomUser>
  private dataSource: DataSource

  constructor() {
    this.messageRepository = dataSource.getRepository(Message)
    this.chatRoomRepository = dataSource.getRepository(ChatRoom)
    this.chatRoomUserRepository = dataSource.getRepository(ChatRoomUser)
    this.dataSource = dataSource
  }

  async saveMessage(chatRoom: ChatRoom | string, senderId: string, content: string) {
    let message = new Message()
    message.id = generateUUID()
    if (typeof chatRoom === 'string') {
      const chatRoomFind = await this.getChatRoom(chatRoom)
      if (!chatRoomFind) {
        throw new Error('Chat room not found')
      }
      message.chatRoom = chatRoomFind
    } else {
      message.chatRoom = chatRoom
    }
    const sender = await this.dataSource.getRepository(User).findOneBy({ id: senderId })
    if (!sender) {
      throw new Error('Sender not found')
    }
    message.user = sender
    message.content = content
    message.createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss')
    message = await this.messageRepository.save(message)
    return message
  }

  async getChatRoom(id: string) {
    return await this.chatRoomRepository.findOneBy({ id })
  }

  async getUsersInChatRoom(chatRoom: ChatRoom) {
    return await this.chatRoomUserRepository.find({
      where: {
        chatRoom
      }
    })
  }
}
