import cookieParser from 'cookie-parser'
import cors from 'cors'

import express from 'express'
import amqplib, { Channel, Connection } from 'amqplib'

import injectSession from './middleware/injectSession'
import setupRoutes from './routes'

import accessEnv from '../helper/accessEnv'

const PORT = parseInt(accessEnv('PORT', '7000'))

const startServer = () => {
  const app = express()
  app.use(express.json())
  app.use(cookieParser())
  app.use(
    cors({
      credentials: true,
      origin: (origin, cb) => cb(null, true)
    })
  )
  // rabbitmq to be global variables
  let channel: Channel, connection: Connection
  // connect to rabbitmq
  async function connect() {
    try {
      // rabbitmq default port is 5672
      const amqpServer = accessEnv('AMQP_SERVER', 'amqp://localhost:5672')
      connection = await amqplib.connect(amqpServer)
      channel = await connection.createChannel()

      // make sure that the channel is created, if not this statement will create it
      await channel.assertQueue('job-queue', { durable: true })
    } catch (error) {
      console.log(error)
    }
  }
  connect()

  setupRoutes(app)

  app.use(injectSession)

  app.listen(PORT, '0.0.0.0', () => {
    console.log('🚗 Hello from Job API Gateway!!!!!!!')
    console.info(`API gateway listening on ${PORT}`)
  })
}

export default startServer
