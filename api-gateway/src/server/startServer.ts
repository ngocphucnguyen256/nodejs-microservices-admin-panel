import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";


import { ApolloServer } from "apollo-server-express";
import { createServer } from 'http';
import { useServer } from 'graphql-ws/lib/use/ws';
import WebSocket, { WebSocketServer } from 'ws';

import { makeExecutableSchema } from '@graphql-tools/schema';
import resolvers from "../graphql/resolvers";
import typeDefs from "../graphql/schema";


import formatGraphQLErrors from "./formatGraphQLErrors";

import accessEnv from "../helper/accessEnv";
import injectSession from "./middleware/injectSession";

const PORT = parseInt(accessEnv("PORT", "7000"));

const startServer = async () => {
  const app = express();
  const httpServer = createServer(app);

  // Create a WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers
  });

  // Use the graphql-ws library to handle WebSocket connections
  useServer({ schema: executableSchema }, wsServer);

  const apolloServer = new ApolloServer({
    context: (a) => a,
    formatError: formatGraphQLErrors,
    schema: executableSchema, // Use the executable schema here as well
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false, path: "/graphql" });

  app.use(cookieParser());

  app.use(
    cors({
      credentials: true,
      origin: (origin, cb) => {
        console.log("origin", origin);
        console.log("cb", cb);
        if (origin === "https://studio.apollographql.com") {
          cb(null, true);
          return;
        }
        if (origin === "http://localhost:3000") {
          cb(null, true);
          return;
        }
      },
    })
  );

  app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
  });

  // Enable pre-flight request for all routes
  app.options('*', cors());

  app.use(injectSession);



  app.listen(PORT, "0.0.0.0", () => {
    console.log("🚗 Hello from Job API Gateway!!!!!!!");
    console.info(`API gateway listening on ${PORT}`);
  });
};

export default startServer;