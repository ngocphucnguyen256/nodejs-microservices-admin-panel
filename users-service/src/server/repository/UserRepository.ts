import { Request, Response } from 'express'
import dataSource from '../../db/data-source'
import User from '../../db/entities/User'
import { generateUUID } from '../../utils'

//for some reusable repository methods
const userRepository = dataSource.getRepository(User)

export default class UserRepository {
  async getUserByUsername(username: string) {
    try {
      if (!username) {
        return null
      }
      const user = await userRepository.findOne({ where: { username: username } })
      if (!user) {
        return null
      }
      return user
    } catch (err: any) {
      return null
    }
  }
  async findById(id: string) {
    try {
      const user = await userRepository.findOne({ where: { id: id } })
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
      if (!email) {
        return null
      }
      const user = await userRepository.findOne({ where: { email: email } })
      if (!user) {
        return null
      }
      return user
    } catch (err: any) {
      return null
    }
  }
  async findByGoogleId(googleId: string) {
    try {
      const user = await userRepository.findOne({ where: { googleId: googleId } })
      if (!user) {
        return null
      }
      return user
    } catch (err: any) {
      return null
    }
  }
  async createUserFromGoogle(profile: any) {
    try {
      const user = new User()
      user.googleId = profile.id
      user.email = profile.emails[0].value
      user.username = profile.displayName
      await userRepository.save(user)
      return user
    } catch (err: any) {
      console.log(err)
      return null
    }
  }
}
