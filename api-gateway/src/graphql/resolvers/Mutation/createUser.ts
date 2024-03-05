import UsersService from "../../../adapters/UsersService";

interface Args {
    username: string;
    password: string;
}

const createUserResolver = async (obj: any, {username, password}: Args) => {
    return await UsersService.createUser({username, password});
};

export default createUserResolver;