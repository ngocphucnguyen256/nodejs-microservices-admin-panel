import { NextFunction, Request, Response } from 'express'

import UsersService from '../services/UsersService'

const injectSession = async (req: Request, res: Response, next: NextFunction) => {
  if (req.cookies.userSessionId) {
    const userSession = await UsersService.fetchUserSession({ sessionId: req.cookies.userSessionId }).catch((error) => {
      console.error('Error fetching user', error)
    })
    res.locals.userSession = userSession
  }

  return next()
}

export default injectSession
