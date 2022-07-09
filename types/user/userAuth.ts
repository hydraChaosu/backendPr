import {Request} from "express";
import {UserTokenResponse} from "./user";

export interface UserAuthReq extends Request{
    user:UserTokenResponse
}
