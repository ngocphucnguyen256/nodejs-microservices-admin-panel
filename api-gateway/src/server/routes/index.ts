import { Express } from "express";
import UsersRoutes from "./UsersRoutes";

const setupRoutes = (app: Express) => {
    UsersRoutes(app, "/api/v1/users-service");
}

export default setupRoutes;