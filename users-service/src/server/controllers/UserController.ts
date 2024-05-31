import { Request, Response, NextFunction } from 'express'
import UserRepository from '../repository/UserRepository'
import dataSource from '../../db/data-source'
import User from '../../db/entities/User'
import { Repository } from 'typeorm'
import omit from 'lodash.omit'
import { Channel } from 'amqplib'
import multer from 'multer'

import {
  generateUUID,
  passwordCompareSync,
  passwordHashSync,
  accessEnv,
  checkData,
  GenerateSignature,
  PublishMessage,
  includeAll,
  include
} from '../../utils'

export default class UserController {
  private userRepository: UserRepository
  private userDataSourceRepository: Repository<User>
  private channel: Channel
  private routeKeys: Record<string, string>
  private upload: multer.Multer

  constructor(channel: Channel, upload: multer.Multer) {
    this.userRepository = new UserRepository()
    this.userDataSourceRepository = dataSource.getRepository(User)
    this.upload = upload
    this.channel = channel
    this.routeKeys = {
      USER_CREATED: 'USER_CREATED',
      USER_UPDATED: 'USER_UPDATED',
      USER_DELETED: 'USER_DELETED'
    }
  }

  loginUser = async (req: Request, res: Response, next: NextFunction) => {
    if ((!req.body.username && !req.body.email) || !req.body.password) {
      return res.status(400).json({ message: 'Invalid body!' })
    }

    try {
      const user = await this.userDataSourceRepository
        .createQueryBuilder('user')
        .addSelect('user.passwordHash')
        .where('user.username = :username', { username: req.body.username || req.body.email })
        .orWhere('user.email = :email', { email: req.body.email })
        .getOne()

      if (!user) return res.status(400).json({ message: 'User not found!' })

      if (!user.passwordHash || !passwordCompareSync(req.body.password, user.passwordHash)) {
        return next(new Error('Invalid password!'))
      }

      //pass checks
      const token = await GenerateSignature({ username: user.username, _id: user.id })
      return res.json({ ...omit(user, ['passwordHash']), token })
    } catch (err) {
      return next(err)
    }
  }

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    console.log('received signup request')
    if ((!req.body.username && !req.body.email) || !req.body.password) {
      return next(new Error('Invalid body!'))
    }

    try {
      const userCheck =
        (await this.userRepository.getUserByUsername(req.body.username)) ||
        (await this.userRepository.getUserByEmail(req.body.email))

      if (userCheck) return next(new Error('Username or email already existed!'))

      const user = {
        id: generateUUID(),
        passwordHash: passwordHashSync(req.body.password),
        username: req.body.username ? req.body.username : req.body.email,
        email: req.body.email ? req.body.email : ''
      }

      await this.userDataSourceRepository.save([user]).then(() => {
        console.log('User created')
        PublishMessage(this.channel, this.routeKeys.USER_CREATED, user)
      })

      return res.json(omit(user, ['passwordHash']))
    } catch (err) {
      return next(err)
    }
  }

  editUser = async (req: Request, res: Response, next: NextFunction, isMe = false) => {
    if (!req.user._id) return res.status(401).json({ message: 'Unauthorized!' })

    try {
      const targetId = isMe ? req.user._id : req.params.userId
      const user = await this.userDataSourceRepository.findOne({ where: { id: targetId } })
      if (!user) return res.status(400).json({ message: 'Invalid user ID!' })

      if (req.body.username) user.username = req.body.username
      if (req.body.email) user.email = req.body.email
      if (req.body.password) user.passwordHash = passwordHashSync(req.body.password)
      if (req.file) {
        const fileUrl = `uploads/${req.file.filename}`
        user.avatarUrl = fileUrl
      }
      await this.userDataSourceRepository.save([user])
      PublishMessage(this.channel, this.routeKeys.USER_UPDATED, user)

      return res.json(user)
    } catch (err) {
      return next(err)
    }
  }

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userDataSourceRepository.findOne({
        where: { id: req.params.userId }
      })

      if (!user) return next(new Error('Invalid user ID!'))
      return res.json(user)
    } catch (err) {
      return next(err)
    }
  }

  getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userDataSourceRepository.findOne({
        where: { id: req.user._id }
      })

      if (!user) return next(new Error('Invalid user ID!'))
      return res.json(user)
    } catch (err) {
      return next(err)
    }
  }

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userDataSourceRepository.find()
      return res.json(users)
    } catch (err) {
      return next(err)
    }
  }
}
