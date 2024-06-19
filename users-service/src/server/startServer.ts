import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import bodyParserErrorHandler from 'express-body-parser-error-handler'
import { urlencoded, json } from 'body-parser'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

import { accessEnv, CreateChannel } from '../utils'
import session from 'express-session'
import googlePassport from './controllers/UserGoogle'
import setupRoutes from './routes'
import router from './expressRouter'

//swagger
import swaggerUi from 'swagger-ui-express'
import swaggerFile from './swagger_output.json'

//logger
import loggerManager from '../logger/loggerManager'

const PORT = parseInt(accessEnv('PORT', '7101'), 10)

const startServer = async () => {
  const app = express()

  const logger = loggerManager.getLogger('users-service', 'error')

  app.use(urlencoded({ extended: true }))
  app.use(json({ limit: '250kb' }))

  // Set up storage engine
  const uploadsDir = path.join(__dirname, '../uploads')
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
  })

  const upload = multer({ storage: storage })

  app.use(
    bodyParserErrorHandler({
      onError: (err: Error, req: Request, res: Response) => {
        logger.error(err.message)
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

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

  app.use('/', router)
  // app.get('/uploads', express.static(uploadsDir))
  app.use('/uploads', express.static(uploadsDir))

  setupRoutes(app, channel, upload)

  // Add request logging middleware at the beginning

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.stack)
    return res.status(500).json({ message: err.message })
  })

  app.listen(PORT, '0.0.0.0', () => {
    console.info(`Users service listening on ${PORT}`)
  })
}

export default startServer
