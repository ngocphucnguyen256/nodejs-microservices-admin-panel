import { Express } from 'express'
import { UserAuth } from './middlewares/UserAuth'
import UserController from './controllers/UserController'
import { Channel } from 'amqplib'

const setupRoutes = (app: Express, channel: Channel) => {
  const userController = new UserController(channel)

  //login
  app.post('/login', async (req, res, next) => {
    return userController.loginUser(req, res, next)
  })

  //Create user
  app.post('/signup', async (req, res, next) => {
    return userController.createUser(req, res, next)
  })

  //Get user info
  app.get('/users/:userId', UserAuth, async (req, res, next) => {
    return userController.getUser(req, res, next)
  })
}

export default setupRoutes
