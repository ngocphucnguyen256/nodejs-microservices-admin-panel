import 'module-alias/register'
import swaggerAutogen from 'swagger-autogen'
import { accessEnv } from '@/utils/index'
import { userSchema } from '@/schema'

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes.ts']

const doc = {
  info: {
    version: '1.0.0',
    title: 'Users Service',
    description: 'Users Service API'
  },
  host: accessEnv('API_GATEWAY_REVERSE_URL', 'localhost:7000/api/user'),
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {},
  definitions: {
    User: userSchema
  }
}

swaggerAutogen(outputFile, endpointsFiles, doc)
