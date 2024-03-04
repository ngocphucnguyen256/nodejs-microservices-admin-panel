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
      const body = await got.get(`${USERS_SERVICE_URI}/users/${userId}`).json();
      if (!body) return null;
      return <User>body;
    } catch (error : any) {
      console.error('Error fetching user', error.response.body);
      throw error;
    }
  }

  static async fetchUserSession({ sessionId }: { sessionId: string }): Promise<UserSession | null> {
    try {
      const body = await got.get(`${USERS_SERVICE_URI}/sessions/${sessionId}`).json();
      if (!body) return null;
      return <UserSession>body;
    } catch (error : any) {
      console.error('Error fetching user session', error.response.body);
      throw error;
    }
  }
}