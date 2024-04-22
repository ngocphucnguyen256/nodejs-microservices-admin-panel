// accesses a variable inside of process.env, throwing an error if it's not found
// always run this method in advance (i.e. upon initialisation) so that the error is thrown as early as possible
// caching the values improves performance – accessing process.env many times is bad

import 'dotenv/config'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import amqplib, { Channel, Connection } from 'amqplib'

const cache: { [key: string]: string } = {}

export const accessEnv = (key: string, defaultValue: string) => {
  if (!(key in process.env) || typeof process.env[key] === 'undefined') {
    if (defaultValue) return defaultValue
    throw new Error(`${key} not found in process.env!`)
  }

  if (!(key in cache)) {
    cache[key] = <string>process.env[key]
  }

  return cache[key]
}

export const generateUUID = () => uuidv4()

export const GenerateSignature = async (payload: any) => {
  try {
    const JWT_SECRET = accessEnv('JWT_SECRET', 'my_secret_key')
    return await jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
  } catch (error) {
    console.log(error)
    return error
  }
}

export const ValidateSignature = async (req: Request) => {
  try {
    const JWT_SECRET = accessEnv('JWT_SECRET', 'my_secret_key')
    const signature = req.get('Authorization')
    if (!signature) return false
    const payload = await jwt.verify(signature.split(' ')[1], JWT_SECRET)
    req.user = payload as any
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

export const checkData = (data: any) => {
  if (data) {
    return { data }
  } else {
    throw new Error('Data Not found!')
  }
}

//Message Broker

const EXCHANGE_NAME = accessEnv('EXCHANGE_NAME', 'amqp://localhost:5672')

export const CreateChannel = async () => {
  const amqpServer = accessEnv('AMQP_SERVER', 'amqp://localhost:5672')
  const connection = await amqplib.connect(amqpServer)
  const channel = await connection.createChannel()
  await channel.assertQueue(EXCHANGE_NAME, { durable: true })
  return channel
}

export const PublishMessage = (channel: Channel, routeKey: string, msg: string) => {
  channel.publish(EXCHANGE_NAME, routeKey, Buffer.from(msg))
  console.log('Sent: ', msg)
}

export const SubscribeMessage = async (channel: Channel, routeKeyController: any) => {
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true })
  const q = await channel.assertQueue('', { exclusive: true })
  console.log(` Waiting for messages in queue: ${q.queue}`)

  routeKeyController.getRouteKeys().forEach((routeKey: string) => {
    channel.bindQueue(q.queue, EXCHANGE_NAME, routeKey)
    console.log(`Waiting for messages in queue: ${q.queue} with routeKey: ${routeKey}`)
  })

  channel.consume(
    q.queue,
    (msg) => {
      if (msg) {
        console.log('the message is:', msg.content.toString())
        routeKeyController.SubscribeEvents(msg.content.toString())
      }
      console.log('[X] received')
    },
    {
      noAck: true
    }
  )
}
