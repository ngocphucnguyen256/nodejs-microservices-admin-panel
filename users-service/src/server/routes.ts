import { Express } from "express";
import dayjs from "dayjs";

import dataSource from "../db/data-source";

import User from "../db/entities/User";
import UserSession from "../db/entities/UserSession";

import generateUUID from "../helper/generateUUID";
import passwordCompareSync from "../helper/passwordCompareSync";
import passwordHashSync from "../helper/passwordHashSync";
import accessEnv from "../helper/accessEnv";

const setupRoutes = (app: Express) => {
  const userRepository = dataSource.getRepository(User);
  const userSessionRepository = dataSource.getRepository(UserSession);

  app.post("/sessions", async (req, res, next) => {
    if (!req.body.username || !req.body.password) {
      return next(new Error("Invalid body!"));
    }

    try {
      const user = await userRepository
      .createQueryBuilder("user")
      .addSelect("user.passwordHash")
      .where("user.username = :username", { username: req.body.username })
      .getOne();

      if (!user) return next(new Error("Invalid username!"));

      if (!passwordCompareSync(req.body.password, user.passwordHash)) {
        return next(new Error("Invalid password!"));
      }

      const expiresAt = dayjs().add(parseInt(accessEnv('USER_SESSION_EXPIRY_HOURS', '1')), "hour").toISOString();

      const sessionToken = generateUUID();

      const userSession = {
        expiresAt,
        id: sessionToken,
        userId: user.id,
      };

      await userSessionRepository.save([userSession]);

      return res.json(userSession);
    } catch (err) {
      return next(err);
    }
  });


  app.post("/users", async (req, res, next) => {
    if (!req.body.username || !req.body.password) {
      return next(new Error("Invalid body!"));
    }

    try {
      const userCheck = await userRepository.findOneBy(
        {
          username: req.body.username,
        }
      );

      if (userCheck) return next(new Error("Username already existed!"));

      const user = {
        id: generateUUID(),
        passwordHash: passwordHashSync(req.body.password),
        username: req.body.username,
      };

      await userRepository.save([user]);

      return res.json(user);
    } catch (err) {
      return next(err);
    }
  });

  app.get("/users/:userId", async (req, res, next) => {
    try {
      const user = await userRepository.findOneBy({
        id: req.params.userId,
      });

      if (!user) return next(new Error("Invalid user ID!"));

      return res.json(user);
    } catch (err) {
      return next(err);
    }
  });
};

export default setupRoutes;