import { Request, Response } from "express";

import { UserSession } from "../adapters/UsersService";

export interface ResolverContext {
  req: Request;
  res: Response;
}

export interface UserSessionType extends UserSession {}