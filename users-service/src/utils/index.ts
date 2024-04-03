// accesses a variable inside of process.env, throwing an error if it's not found
// always run this method in advance (i.e. upon initialisation) so that the error is thrown as early as possible
// caching the values improves performance – accessing process.env many times is bad

import 'dotenv/config'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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

export const passwordCompareSync = (passwordToTest: string, passwordHash: string) =>
  bcrypt.compareSync(passwordToTest, passwordHash)

export const passwordHashSync = (password: string) => bcrypt.hashSync(password, bcrypt.genSaltSync(12))

export const GenerateSignature = async (payload: any) => {
  try {
    const JWT_SECRET = accessEnv('JWT_SECRET', 'my_secret_key')
    return await jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
  } catch (error) {
    console.log(error)
    return error
  }
}

export const ValidateSignature = async (req: any) => {
  try {
    const JWT_SECRET = accessEnv('JWT_SECRET', 'my_secret_key')
    const signature = req.get('Authorization')
    console.log(signature)
    if (!signature) return false
    console.log(signature)
    const payload = await jwt.verify(signature.split(' ')[1], JWT_SECRET)
    req.user = payload
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
