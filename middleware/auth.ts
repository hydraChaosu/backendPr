import { NextFunction } from "express";
import { Response } from "express/ts4.0";
import { AuthInvalidError, TokenError } from "../utils/errors";
import { AuthRequest, IsAdminRequest, UserAuthReq } from "../types";

const jwt = require("jsonwebtoken");

export function authenticateToken(
  req: UserAuthReq,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];

  let token = null;

  if (typeof authHeader === "string") {
    token = authHeader;
  }

  if (token == null) {
    throw new TokenError();
  }

  jwt.verify(
    token,
    process.env.TOKEN_SECRET as string,
    (err: any, user: any) => {
      console.log(err);

      if (err) throw new AuthInvalidError();

      req.user = user;

      next();
    }
  );
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

function isAuthenticated(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (req.session.user) {
    next(); //If session exists, proceed to page
  } else {
    const err = new Error("Not logged in!");
    console.log(req.session.user);
    next(err); //Error, trying to access unauthorized page!
  }
}

// export const checkIfUserIsActivated = (user: UserRecord): boolean =>
//   user.isActive === 1;
