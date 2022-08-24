import { Request } from "express";
import { UserTokenResponse } from "./user";
import { Session } from "express-session";

export interface UserAuthReq extends Request {
  user: UserTokenResponse;
}

export interface SessionData {
  user: { [key: string]: any };
}

export type AuthRequest = Request & {
  session?: SessionWithUser;
  auth?: { user: string; permission_id: number };
};

export type SessionWithUser = Session & { user: string | {} };
