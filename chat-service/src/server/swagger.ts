import swaggerAutogen from 'swagger-autogen'
import { accessEnv } from '../utils/index'
import { messageSchema, chatRoomSchema, userSchema, chatRoomUserSchema } from '../schema'

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes.ts']

const doc = {
  info: {
    version: '1.0.0', // by default: '1.0.0'
    title: 'Chat Service', // by default: 'REST API'
    description: 'Chat Service API' // by default: ''
  },
  host: accessEnv('API_GATEWAY_REVERSE_URL', 'localhost:7000/api/chat'),
  schemes: ['http'], // by default: ['http']
  consumes: ['application/json'], // by default: ['application/json']
  produces: ['application/json'], // by default: ['application/json']
  securityDefinitions: {}, // by default: empty object
  definitions: {
    Message: messageSchema,
    ChatRoom: chatRoomSchema,
    User: userSchema,
    ChatRoomUser: chatRoomUserSchema
  } // by default: empty object
}

swaggerAutogen(outputFile, endpointsFiles, doc)
