import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import resolvers from "../graphql/resolvers";
import schema from "../graphql/schema";

import formatGraphQLErrors from "./formatGraphQLErrors";

import accessEnv from "../helper/accessEnv";
import injectSession from "./middleware/injectSession";

const PORT = parseInt(accessEnv("PORT", "7000"));

const startServer = () => {
  const apolloServer = new ApolloServer({
    context: (a) => a,
    formatError: formatGraphQLErrors,
    resolvers,
    typeDefs: schema,
  });

  const app = express();

  app.use(cookieParser());

  app.use(
    cors({
      credentials: true,
      origin: (origin, cb) => cb(null, true),
    })
  );

  app.use(injectSession);
  apolloServer.applyMiddleware({ app, cors: false, path: "/graphql" });

  app.listen(PORT, "0.0.0.0", () => {
    console.log("🚗 Hello from Job API Gateway!!!!!!!");
    console.info(`API gateway listening on ${PORT}`);
  });
};

export default startServer;