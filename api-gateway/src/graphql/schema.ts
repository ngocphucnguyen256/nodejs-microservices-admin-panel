import { gql } from "apollo-server";

const schema = gql`
  scalar Date
  type User {
    id: ID!
    username: String!
  }
  type UserSession {
    createdAt: Date!
    expiresAt: Date!
    id: ID!
    user: User!
  }
  type Query {
    userSession(me: Boolean!): UserSession
  }
  type Mutation {
    createUser(username: String!, password: String!): User!
    createUserSession(username: String!, password: String!): UserSession!
    deleteUserSession(sessionId: ID!): Boolean!
  }
`;

export default schema;