import {UserEntity} from "./user.entity";

export type CreateUserReq = Omit<UserEntity, 'id'>;

export interface SetUserCategoryReq {
    email?: string;
    password?: string;
    login?: string;
}
