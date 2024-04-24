import { Express } from 'express'
import { UserAuth } from './middlewares/UserAuth'
import UserController from './controllers/UserController'
import { Channel } from 'amqplib'
import multer from 'multer'

const setupRoutes = (app: Express, channel: Channel, upload: multer.Multer) => {
  const userController = new UserController(channel, upload)

  //login
  app.post('/login', async (req, res, next) => {
    return userController.loginUser(req, res, next)
  })

  //Create user
  app.post('/signup', async (req, res, next) => {
    return userController.createUser(req, res, next)
  })

  app.get('/users', UserAuth, async (req, res, next) => {
    return userController.getUsers(req, res, next)
  })

  //Get user info
  app.get('/users/:userId', UserAuth, async (req, res, next) => {
    return userController.getUser(req, res, next)
  })

  //Edit user
  app.put('/users/:userId', UserAuth, upload.single('avatar'), async (req, res, next) => {
    return userController.editUser(req, res, next)
  })

  app.get('/users/:userId/avatar', async (req, res, next) => {
    return userController.getUserAvatar(req, res, next)
  })
}

export default setupRoutes
