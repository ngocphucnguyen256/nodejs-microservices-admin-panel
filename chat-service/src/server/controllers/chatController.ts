import { Request, Response } from 'express'

import dayjs from 'dayjs'
import dataSource from '../../db/data-source'
import Message from '../../db/entities/Message'
import ChatRoom from '../../db/entities/ChatRoom'

import { generateUUID } from '../../utils'

const messageRepository = dataSource.getRepository(Message)
const chatRoomRepository = dataSource.getRepository(ChatRoom)

export const createChatRoom = async (req: Request, res: Response) => {
  const reqUser = req.user
  // Logic to create a chat room
  let chatRoom = new ChatRoom()
  chatRoom.id = generateUUID()
  chatRoom.name = req.body.name
  chatRoom = await chatRoomRepository.save(chatRoom)
  return res.json(chatRoom)
}

export const listChatRooms = async (req: Request, res: Response) => {
  // Logic to list chat rooms
  const chatRooms = await chatRoomRepository.find()
  return res.json(chatRooms)
}

export const sendMessage = async (req: Request, res: Response) => {
  const reqUser = req.user
  if (!reqUser) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  // Fetch the ChatRoom entity using the provided chatRoomId
  const chatRoom = await chatRoomRepository.findOneBy({
    id: req.body.chatRoomId
  })
  if (!chatRoom) {
    return res.status(404).json({ message: 'Chat room not found' })
  }
  // Logic to send a message
  let message = new Message()
  message.id = generateUUID()
  message.chatRoom = chatRoom
  message.senderId = reqUser._id
  message.content = req.body.content
  message.createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss')
  message = await messageRepository.save(message)
  return res.json(message)
}

export const listMessages = async (req: Request, res: Response) => {
  // Logic to list messages
  const messages = await messageRepository.find({
    where: {
      chatRoom: { id: req.params.id }
    }
  })
  return res.json(messages)
}
