import { NextFunction } from "express";
import { Response } from "express/ts4.0";
import {
  AuthInvalidError,
  InvalidTokenError,
  TokenError,
} from "../utils/errors";
import { UserAuthReq, UserRole } from "../types";
import { UserRecord } from "../records";
import { isNull } from "../utils/dataCheck";

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
        console.log(payload?.id);

        if (!payload || !payload.id) {
          throw new InvalidTokenError();
        }
        if (err) throw new AuthInvalidError();

        req.user = await UserRecord.getOneByToken(payload.id);
        isNull(req.user, null, "user does not exists");

        next();
      }
    );
  } catch (e) {
    throw new TokenError();
  }
}

// export const checkIfUserIsActivated = (user: UserRecord): boolean =>
//   user.isActive === 1;

export const checkIfCorrectUserRole =
  (role: UserRole[]) =>
  (req: UserAuthReq, res: Response, next: NextFunction) => {
    if (role.some((role: UserRole) => role === req.user.role)) {
      next();
    } else {
      throw new AuthInvalidError();
    }
  };
