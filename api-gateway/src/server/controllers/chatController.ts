import { NextFunction, Request, Response } from 'express'
import ChatService from '../services/ChatService'

export const createChatRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chatRoom = await ChatService.createChatRoom(req, res, next)
    if (chatRoom) return res.json(chatRoom)
    return res.status(404).send()
  } catch (error) {
    return next(error)
  }
}

export const listChatRooms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chatRooms = await ChatService.listChatRooms(req, res, next)
    if (chatRooms) return res.json(chatRooms)
    return res.status(404).send()
  } catch (error) {
    return next(error)
  }
}

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const message = await ChatService.sendMessage(req, res, next)
    if (message) return res.json(message)
    return res.status(404).send()
  } catch (error) {
    return next(error)
  }
}

export const listMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await ChatService.listMessages(req, res, next)
    if (messages) return res.json(messages)
    return res.status(404).send()
  } catch (error) {
    return next(error)
  }
}
