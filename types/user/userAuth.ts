import { Request } from "express";
import { UserRecord } from "../../records";

export interface UserAuthReq extends Request {
  user: UserRecord;
}

export type UserLoggedIn = {
  isSuccess: true;
  userId: string;
};

// export interface UserAuthReq extends Request {
//   user: UserTokenResponse;
// }
