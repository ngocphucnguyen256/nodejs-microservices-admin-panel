import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import bodyParserErrorHandler from 'express-body-parser-error-handler'
import { urlencoded, json } from 'body-parser'
import multer from 'multer'

import { accessEnv, CreateChannel } from '../utils'
import session from 'express-session'
import googlePassport from './controllers/UserGoogle'
import setupRoutes from './routes'
import router from './expressRouter'

const PORT = parseInt(accessEnv('PORT', '7101'), 10)

const startServer = async () => {
  const app = express()

  app.use(urlencoded({ extended: true }))
  app.use(json({ limit: '250kb' }))

  // Set up storage engine
  const storage = multer.memoryStorage() // Stores files in memory
  const upload = multer({ storage: storage })

  app.use(
    bodyParserErrorHandler({
      onError: (err: Error, req: Request, res: Response) => {
        console.log(err)
        return res.status(400).json({ message: err.message })
      }
    })
  )

  app.use(
    cors({
      origin: '*', // Allow all origins
      credentials: true // Accept credentials (cookies, authentication, etc.) from the request
    })
  )

  const channel = await CreateChannel()

  app.use(
    session({
      secret: accessEnv('SESSION_SECRET', 'secret'),
      resave: false,
      saveUninitialized: true
    })
  )
  app.use(googlePassport.initialize())
  app.use(googlePassport.session())

  app.use('/', router)
  setupRoutes(app, channel, upload)

  // Add request logging middleware at the beginning

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    return res.status(500).json({ message: err.message })
  })

  app.listen(PORT, '0.0.0.0', () => {
    console.info(`Users service listening on ${PORT}`)
  })
}

export default startServer
