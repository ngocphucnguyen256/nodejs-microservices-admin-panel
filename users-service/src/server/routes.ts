import { Express } from 'express'
import dayjs from 'dayjs'
import omit from 'lodash.omit'

import dataSource from '../db/data-source'
import User from '../db/entities/User'

import { generateUUID, passwordCompareSync, passwordHashSync, accessEnv, checkData, GenerateSignature } from '../utils'
import { UserAuth } from './middlewares/UserAuth'

const setupRoutes = (app: Express) => {
  const userRepository = dataSource.getRepository(User)

  //login
  app.post('/login', async (req, res, next) => {
    console.log('received login request')
    if ((!req.body.username && !req.body.email) || !req.body.password) {
      return next(new Error('Invalid body!'))
    }

    try {
      const user = await userRepository
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
  })

  //Create user
  app.post('/signup', async (req, res, next) => {
    if ((!req.body.username && !req.body.email) || !req.body.password) {
      return next(new Error('Invalid body!'))
    }

    try {
      const userCheck =
        (await userRepository.findOneBy({
          username: req.body.username
        })) ||
        (await userRepository.findOneBy({
          email: req.body.email
        }))

      if (userCheck) return next(new Error('Username or email already existed!'))

      const user = {
        id: generateUUID(),
        passwordHash: passwordHashSync(req.body.password),
        username: req.body.username ? req.body.username : req.body.email,
        email: req.body.email ? req.body.email : ''
      }

      await userRepository.save([user])

      return res.json(omit(user, ['passwordHash']))
    } catch (err) {
      return next(err)
    }
  })

  //Get user info
  app.get('/users/:userId', UserAuth, async (req, res, next) => {
    try {
      const user = await userRepository.findOneBy({
        id: req.params.userId
      })

      if (!user) return next(new Error('Invalid user ID!'))

      return res.json(user)
    } catch (err) {
      return next(err)
    }
  })
}

export default setupRoutes
