import { v4 as uuid } from "uuid";
import { UserRecord } from "../records";

const jwt = require("jsonwebtoken");

export async function generateAuthToken(user: UserRecord) {
  let token;
  let userWithThisToken = null;

  do {
    token = uuid();
    userWithThisToken = await UserRecord.isAuthTokenUsed(token);
  } while (!!userWithThisToken);

  user.token = token;
  await user.update();

  return jwt.sign({ id: token }, process.env.TOKEN_SECRET, {
    expiresIn: 1000 * 60 * 15,
  });
}

// export async function generateActivateToken(user: UserRecord) {
//   let token = jwt.sign({ id: uuid() }, process.env.TOKEN_SECRET, {
//     expiresIn: "1800s",
//   });
//   user.activateToken = token;
//   await user.update();
//   return token;
// }

export function generateAdminAccessToken(admin: { id: string }) {
  return jwt.sign(admin, process.env.ADMIN_SECRET, { expiresIn: "1800s" });
}
