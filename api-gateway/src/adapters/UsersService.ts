import got from "got";
import accessEnv from "../helper/accessEnv";

const USERS_SERVICE_URI = accessEnv("USERS_SERVICE_URL", "http://users-service:7101");

export interface User {
  createdAt: string;
  id: string;
  username: string;
}

export interface UserSession {
  createdAt: string;
  expiresAt: string;
  id: string;
  userId: string;
}

export default class UsersService {
  static async fetchUser({ userId }: { userId: string }): Promise<User | null> {
    try {
      const body = <User>await got.get(`${USERS_SERVICE_URI}/users/${userId}`).json();
      if (!body) return null;
      return body;
    } catch (error : any) {
      console.error('Error fetching user', error.response.body);
      throw error;
    }
  }

  static async createUser({ username, password }: { username: string, password: string }) {
    try {
      const body = <User>await got.post(`${USERS_SERVICE_URI}/users`, {
        json: { username, password }
      }).json();
      if (!body) return null;
      return body;
    } catch (error : any) {
      console.error('Error creating user', error.response.body);
      throw error;
    }
  }

  static async fetchUserSession({ sessionId }: { sessionId: string }) {
    try {
      const body = <UserSession>await got.get(`${USERS_SERVICE_URI}/sessions/${sessionId}`).json();
      if (!body) return null;
      return body;
    } catch (error : any) {
      console.error('Error fetching user session', error.response.body);
      throw error;
    }
  }

  static async createUserSession({ username, password }: { username: string, password: string }) {
    try {
      const body = <UserSession>await got.post(`${USERS_SERVICE_URI}/sessions`, {
        json: { username, password }
      }).json();
      return body;
    } catch (error : any) {
      console.error('Error creating user session', error.response.body);
      throw error;
    }
  }
}