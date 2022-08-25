import { UserTokenResponse } from "../types";

const jwt = require("jsonwebtoken");

export function generateAccessToken(user: UserTokenResponse) {
  return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
}

export function generateAdminAccessToken(admin: { id: string }) {
  return jwt.sign(admin, process.env.ADMIN_SECRET, { expiresIn: "1800s" });
}
