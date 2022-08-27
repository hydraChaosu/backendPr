import { NextFunction } from "express";
import { Response } from "express/ts4.0";
import {
  AuthInvalidError,
  InvalidTokenError,
  TokenError,
} from "../utils/errors";
import { IsAdminRequest, UserAuthReq } from "../types";
import { UserRecord } from "../records";

const jwt = require("jsonwebtoken");

export function authenticateToken(
  req: UserAuthReq,
  res: Response,
  next: NextFunction
): void {
  let token: any = req.cookies.jwt ? req.cookies.jwt : null;

  if (token === null) {
    throw new TokenError();
  }

  try {
    jwt.verify(
      token,
      process.env.TOKEN_SECRET as string,
      async (err: any, payload: any) => {
        console.log(err);
        console.log(payload);
        console.log(payload.id);

        if (!payload || !payload.id) {
          throw new InvalidTokenError();
        }
        if (err) throw new AuthInvalidError();

        req.user = await UserRecord.getOneByToken(payload.id);
        next();
      }
    );
  } catch (e) {
    throw new TokenError();
  }
}

export function adminToken(
  req: IsAdminRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["admin-authorization"];

  let token = null;

  if (typeof authHeader === "string") {
    token = authHeader;
  }

  if (token == null) {
    throw new TokenError();
  }

  jwt.verify(
    token,
    process.env.ADMIN_SECRET as string,
    (err: any, user: any) => {
      console.log(err);

      if (err) throw new AuthInvalidError();

      req.isAdmin = true;

      next();
    }
  );
}

// export const checkIfUserIsActivated = (user: UserRecord): boolean =>
//   user.isActive === 1;
