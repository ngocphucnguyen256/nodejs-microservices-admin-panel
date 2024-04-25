import { Router } from 'express'
import passport from 'passport'

const router = Router()

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }), (req, res, next) => {
  // console.log('Query Parameters:', req.query)
  next()
})

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  // Successful authentication, redirect home.
  res.send('Successfully authenticated!')
})

export default router
