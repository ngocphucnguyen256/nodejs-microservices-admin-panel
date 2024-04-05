import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
// import amqplib, { Channel, Connection } from 'amqplib'
import bodyParserErrorHandler from 'express-body-parser-error-handler'
import { urlencoded, json } from 'body-parser'

import { accessEnv } from '../utils'

import setupRoutes from './routes'

const PORT = parseInt(accessEnv('PORT', '7101'), 10)

const startServer = () => {
  const app = express()

  // app.use(urlencoded({ extended: false, limit: '250kb' }))
  app.use(json({ limit: '250kb' }))

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

  // // rabbitmq to be global variables
  // let channel: Channel, connection: Connection
  // // connect to rabbitmq
  // async function connect() {
  //   try {
  //     // rabbitmq default port is 5672
  //     const amqpServer = accessEnv('AMQP_SERVER', 'amqp://localhost:5672')
  //     connection = await amqplib.connect(amqpServer)
  //     channel = await connection.createChannel()

  //     // make sure that the channel is created, if not this statement will create it
  //     await channel.assertQueue('user-queue', { durable: true })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // connect()

  setupRoutes(app)

  // Add request logging middleware at the beginning

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    return res.status(500).json({ message: err.message })
  })

  app.listen(PORT, '0.0.0.0', () => {
    console.info(`Users service listening on ${PORT}`)
  })
}

export default startServer
