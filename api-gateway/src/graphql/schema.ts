const schema = /* GraphQL */ `
  scalar Date
  type User {
    username: ID!
  }
  type UserSession {
    createdAt: Date!
    expiresAt: Date!
    user: User!
  }
  type Query {
    userSession(me: Boolean!): UserSession
  }
  type Mutation {
    createUser(username: String!, password: String!): User!
    createUserSession(username: String!, password: String!): UserSession!
    deleteUserSession(sessionId: ID!): Boolean!
    sendMessage(sender: String!, content: String!): Message
  }
  type Subscription {
    messageReceived: Message
  },
  type Message {
    id: ID!
    sender: String!
    content: String!
  }
`;

export default schema;