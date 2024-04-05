import { Request, Response } from 'express'
import dataSource from '../../db/data-source'
import User from '../../db/entities/User'
import { generateUUID } from '../../utils'

//for some reusable repository methods
const userRepository = dataSource.getRepository(User)

export default class UserRepository {
  async getUserByUsername(username: string) {
    try {
      const user = await userRepository.findOne({ where: { username: username } })
      if (!user) {
        return null
      }
      return user
    } catch (err: any) {
      return null
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await userRepository.findOne({ where: { email: email } })
      if (!user) {
        return null
      }
      return user
    } catch (err: any) {
      return null
    }
  }
}
