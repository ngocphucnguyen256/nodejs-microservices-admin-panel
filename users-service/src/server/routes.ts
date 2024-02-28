import { Express } from "express";
import dataSource from "../db/data-source";

import User from "../db/entities/User";

const setupRoutes = (app: Express) => {
  const userRepository = dataSource.getRepository(User);

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