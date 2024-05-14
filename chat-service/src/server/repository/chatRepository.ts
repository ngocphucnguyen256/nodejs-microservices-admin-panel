import dataSource from '../../db/data-source'
import Message from '../../db/entities/Message'
import ChatRoom from '../../db/entities/ChatRoom'
import User from '../../db/entities/User'
import ChatRoomUser from '../../db/entities/ChatRoomUser'
import { Repository, DataSource } from 'typeorm'
import { generateUUID, PublishMessage } from '../../utils'
import dayjs from 'dayjs'
import { Channel } from 'amqplib'

export default class ChatRepository {
  private messageRepository: Repository<Message>
  private chatRoomRepository: Repository<ChatRoom>
  private chatRoomUserRepository: Repository<ChatRoomUser>
  private dataSource: DataSource
  private channel: Channel
  private routeKeys: Record<string, string>

  constructor(channel: Channel) {
    this.messageRepository = dataSource.getRepository(Message)
    this.chatRoomRepository = dataSource.getRepository(ChatRoom)
    this.chatRoomUserRepository = dataSource.getRepository(ChatRoomUser)
    this.dataSource = dataSource
    this.channel = channel
    this.routeKeys = {
      USER_CREATED: 'USER_CREATED',
      USER_UPDATED: 'USER_UPDATED',
      USER_DELETED: 'USER_DELETED',
      CREATE_NOTIFICATION: 'CREATE_NOTIFICATION'
    }
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
    //send notification
    const users = await this.getUsersInChatRoom(message.chatRoom)
    message.content = `You have a new message from${sender.username}`
    PublishMessage(
      this.channel,
      this.routeKeys.CREATE_NOTIFICATION,
      JSON.stringify({
        users: users,
        message
      })
    )
    return message
  }

  async getChatRoom(id: string) {
    return await this.chatRoomRepository.findOneBy({ id })
  }

  async getUsersInChatRoom(chatRoom: ChatRoom) {
    return await this.chatRoomUserRepository.find({
      where: {
        chatRoom: { id: chatRoom.id }
      }
    })
  }

  async addUserToChatRoom(chatRoomId: string, userId: string) {
    const chatRoom = await this.getChatRoom(chatRoomId)
    if (!chatRoom) {
      throw new Error('Chat room not found')
    }
    const user = await this.dataSource.getRepository(User).findOneBy({ id: userId })
    if (!user) {
      throw new Error('User not found')
    }
    const chatRoomUser = new ChatRoomUser()
    chatRoomUser.id = generateUUID()
    chatRoomUser.chatRoom = chatRoom
    chatRoomUser.user = user
    const check = await this.chatRoomUserRepository.find({
      where: {
        chatRoom: { id: chatRoom.id },
        user: { id: user.id }
      }
    })
    if (check.length > 0) {
      return
    }
    await this.chatRoomUserRepository.save(chatRoomUser)
  }
}
