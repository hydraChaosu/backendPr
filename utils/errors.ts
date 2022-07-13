import { NextFunction, Request, Response } from "express";

export class ValidationError extends Error {}
export class NotFoundError extends Error {}
export class AuthInvalidError extends Error {}
export class TokenError extends Error {}
export class InvalidTokenError extends Error {}
export class ImpossibleShopRequestError extends Error {}

export const handleError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);

  if (err instanceof NotFoundError) {
    res.status(404).json({
      message: "Not found",
    });
    return;
  }

  if (err instanceof TokenError) {
    res.status(401).json({
      message: "no token",
    });
    return;
  }

  if (err instanceof AuthInvalidError) {
    res.status(403).json({
      message: "no access",
    });
    return;
  }

  if (err instanceof InvalidTokenError) {
    res.status(403).json({
      message: "InvalidTokenError",
    });
    return;
  }

  if (err instanceof ImpossibleShopRequestError) {
    res.status(400).json({
      message: err.message,
    });
    return;
  }

  res.status(err instanceof ValidationError ? 400 : 500).json({
    message:
      err instanceof ValidationError
        ? err.message
        : "Przepraszamy, spróbuj ponownie za kilka minut.",
  });
};
