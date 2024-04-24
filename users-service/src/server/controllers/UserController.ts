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
      return next(new Error('Invalid body!'))
    }

    try {
      const user = await this.userDataSourceRepository
        .createQueryBuilder('user')
        .addSelect('user.passwordHash')
        .where('user.username = :username', { username: req.body.username || req.body.email })
        .orWhere('user.email = :email', { email: req.body.email })
        .getOne()

      if (!user) return next(new Error('Invalid username!'))

      if (!passwordCompareSync(req.body.password, user.passwordHash)) {
        return next(new Error('Invalid password!'))
      }

      //pass checks
      const token = await GenerateSignature({ username: user.username, _id: user.id })
      return res.json(checkData({ id: user.id, token }))
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

  getUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userDataSourceRepository.findOne({ where: { id: req.params.userId }, select: ['avatar'] })
      if (!user || !user.avatar) {
        return res.status(404).send('User not found or user has no avatar!')
      }
      res.set('Content-Type', 'image/jpeg')
      return res.send(user.avatar)
    } catch (err) {
      return next(err)
    }
  }

  editUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user._id) return next(new Error('Invalid body!'))

    try {
      const targetId = req.params.userId
      const user = await this.userDataSourceRepository.findOne({ where: { id: targetId } })
      if (!user) return next(new Error('Invalid user ID!'))

      if (req.body.username) user.username = req.body.username
      if (req.body.email) user.email = req.body.email
      if (req.body.password) user.passwordHash = passwordHashSync(req.body.password)
      if (req.file) user.avatar = req.file ? req.file.buffer : user.avatar
      await this.userDataSourceRepository.save([user])

      return res.json(omit(user, ['avatar']))
    } catch (err) {
      return next(err)
    }
  }

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userDataSourceRepository.findOne({
        where: { id: req.params.userId },
        select: include(this.userDataSourceRepository, ['avatar'])
      })

      if (!user) return next(new Error('Invalid user ID!'))
      const avatarUrl = user.avatar ? `/users/${user.id}/avatar` : null
      return res.json({ ...omit(user, 'avatar'), avatarUrl })
    } catch (err) {
      return next(err)
    }
  }

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userDataSourceRepository.find({
        select: include(this.userDataSourceRepository, ['avatar'])
      })
      const formattedUsers = users.map((user) => {
        const avatarUrl = user.avatar ? `/users/${user.id}/avatar` : null
        return { ...omit(user, 'avatar'), avatarUrl }
      })
      return res.json(formattedUsers)
    } catch (err) {
      return next(err)
    }
  }
}
