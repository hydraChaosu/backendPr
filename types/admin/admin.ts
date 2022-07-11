import {Request} from "express";

export interface AdminLoginRequest {
    login: string;
    password: string;
}

export interface IsAdminRequest extends Request {
    isAdmin: boolean;
}

export interface AdminLoginUserReq extends Request {
    id: string;
}

export interface AdminSetUserCategoryReq {
    id: string;
    email?: string;
    password?: string;
    login?: string;
}


export interface AdminSetPersonalInfoReq {
    id: string;
    userId: string;
    name?: string;
    surname?: string;
    street?: string;
    buildingNumber?: string;
    postalCode?: string;
    city?: string;
    country?: string;
}

export interface AdminDeletePersonalInfoReq {
    id: string;
}

export interface AdminPersonalInfoCreateReq {
    id: string;
    userId: string;
    name?: string;
    surname?: string;
    street?: string;
    buildingNumber?: string;
    postalCode?: string;
    city?: string;
    country?: string;
}
