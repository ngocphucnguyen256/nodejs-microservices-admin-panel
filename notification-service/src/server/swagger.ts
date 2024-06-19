import 'module-alias/register'
import swaggerAutogen from 'swagger-autogen'
import { accessEnv } from '@/utils/index'
import { notificationSchema, notificationLogSchema, serviceSchema, userSchema } from '@/schema'

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes.ts']

const doc = {
  info: {
    version: '1.0.0',
    title: 'Notification Service',
    description: 'Notification Service API'
  },
  host: accessEnv('API_GATEWAY_REVERSE_URL', 'localhost:7000/api/notification'),
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {},
  definitions: {
    Notification: notificationSchema,
    NotificationLog: notificationLogSchema,
    Service: serviceSchema,
    User: userSchema
  }
}

swaggerAutogen(outputFile, endpointsFiles, doc)
