import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import UserRepository from '../repository/UserRepository'
import { accessEnv } from '../../utils'

passport.use(
  new GoogleStrategy(
    {
      clientID: accessEnv('GOOGLE_CLIENT_ID', ''),
      clientSecret: accessEnv('GOOGLE_CLIENT_SECRET', ''),
      callbackURL: 'http://localhost:7000/api/user/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log('AccessToken:', accessToken)
      console.log('Profile:', profile)
      const userRepository = new UserRepository()
      // Check if user already exists in your DB
      let user = await userRepository.findByGoogleId(profile.id)
      if (!user) {
        // If user not found, create a new one
        user = await userRepository.createUserFromGoogle(profile)
      }
      if (!user) {
        return cb(null, undefined)
      }
      return cb(null, user)
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  const userRepository = new UserRepository()
  const user = await userRepository.findById(id as string)
  done(null, user)
})

export default passport
