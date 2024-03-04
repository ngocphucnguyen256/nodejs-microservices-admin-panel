import { error } from "console";
import UsersService from "../../adapters/UsersService";
import { UserSessionType } from "../types";

const UserSession = {
  user: async (userSession: UserSessionType) => {
    return await UsersService.fetchUser({ userId: userSession.userId })
    .catch((error) => {
        console.error("Error fetching user", error);
    });
  },
};

export default UserSession;