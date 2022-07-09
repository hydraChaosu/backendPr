import {Request} from "express";

export interface AdminLoginRequest {
    login: string;
    password: string;
}

export interface IsAdminRequest extends Request {
    isAdmin: boolean;
}

