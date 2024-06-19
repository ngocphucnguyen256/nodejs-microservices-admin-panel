import 'module-alias/register'
import swaggerAutogen from 'swagger-autogen'
import accessEnv from '@/helper/accessEnv'

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes/index.ts']

const doc = {
  info: {
    version: '1.0.0',
    title: 'API Gateway',
    description: 'API Gateway'
  },
  host: accessEnv('API_GATEWAY_REVERSE_URL', 'localhost:7000'),
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {},
  definitions: {}
}

swaggerAutogen(outputFile, endpointsFiles, doc)
