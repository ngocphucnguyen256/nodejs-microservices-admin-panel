import UsersService from "../../../adapters/UsersService";
import { ResolverContext } from "../../types";

interface Args {
    username: string;
    password: string;
}

const createUserSessionResolver = async (obj: any, {username, password}: Args, context: ResolverContext) => {
    const userSession = await UsersService.createUserSession({username, password});
    context.res.cookie('userSessionId', userSession.id, { httpOnly: true });
    return userSession;
};

export default createUserSessionResolver;

