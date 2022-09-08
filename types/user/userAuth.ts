import { Request } from "express";
import { UserRecord } from "../../records";

export interface UserAuthReq extends Request {
  user: UserRecord;
}

// export interface UserAuthReq extends Request {
//   user: UserTokenResponse;
// }
