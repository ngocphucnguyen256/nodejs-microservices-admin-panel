import dataSource from '../../db/data-source'
import Message from '../../db/entities/Message'
import ChatRoom from '../../db/entities/ChatRoom'
import { Repository, DataSource } from 'typeorm'
import { generateUUID } from '../../utils'
import dayjs from 'dayjs'

export default class ChatRepository {
  private messageRepository: Repository<Message>
  private chatRoomRepository: Repository<ChatRoom>
  private dataSource: DataSource

  constructor() {
    this.messageRepository = dataSource.getRepository(Message)
    this.chatRoomRepository = dataSource.getRepository(ChatRoom)
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
    message.senderId = senderId
    message.content = content
    message.createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss')
    message = await this.messageRepository.save(message)
    return message
  }

  async getChatRoom(id: string) {
    return await this.chatRoomRepository.findOneBy({ id })
  }
}
