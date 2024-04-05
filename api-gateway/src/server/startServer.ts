// import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import setupRoutes from './routes'
import accessEnv from '../helper/accessEnv'

const PORT = parseInt(accessEnv('PORT', '7000'))

const startServer = () => {
  const app = express()
  // app.use(express.json())
  // app.use(cookieParser())
  app.use(
    cors({
      origin: '*', // Allow all origins
      credentials: true // Accept credentials (cookies, authentication, etc.) from the request
    })
  )
  setupRoutes(app)

  app.listen(PORT, '0.0.0.0', () => {
    console.log('🚗 Hello from Job API Gateway!!!!!!!')
    console.info(`API gateway listening on ${PORT}`)
  })
}

export default startServer
