import { Express } from "express";

import UsersService from "../services/UsersService";

export default function UsersRoutes(app: Express, prefix: string = "") {
  // get user by id
  app.get(`${prefix}/users/:userId`, async (req, res, next) => {
    try {
      const user = await UsersService.fetchUser({ userId: req.params.userId });
      if (user) return res.json(user);
      return res.status(404).send();
    } catch (error) {
      return next(error);
    }
  }
  );

  // create user
  app.post(`${prefix}/users`, async (req, res, next) => {
    try {
      const user = await UsersService.createUser(req.body);
      return res.json(user);
    } catch (error) {
      return next(error);
    }
  }
  );

  // get session by id
  app.get(`${prefix}/sessions/:sessionId`, async (req, res, next) => {
    try {
      const session = await UsersService.fetchUserSession({ sessionId: req.params.sessionId });
      if (session) return res.json(session);
      return res.status(404).send();
    } catch (error) {
      return next(error);
    }
  }
  );


  // create session - login
  app.post(`${prefix}/sessions`, async (req, res, next) => {
    try {
      const session = await UsersService.createUserSession(req.body);
      return res.json(session);
    } catch (error) {
      return next(error);
    }
  }
  );

  // delete session - logout
  app.delete(`${prefix}/sessions/:sessionId`, async (req, res, next) => {
    try {
      const session = await UsersService.deleteUserSession({ sessionId: req.params.sessionId });
      return res.json(session);
    } catch (error) {
      return next(error);
    }
  }
  );
}