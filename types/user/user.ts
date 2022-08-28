import { UserEntity } from "./user.entity";

export type CreateUserReq = Omit<UserEntity, "id">;
export type LoginUserReq = Omit<CreateUserReq, "email">;

export interface SetUserCategoryReq {
  email?: string;
  password?: string;
  login?: string;
}

export type UserTokenResponse = Omit<UserEntity, "password">;

// export interface UserTokenResponse {
//   email: string;
//   id: string;
// }

export interface GetOneUserReq {
  id: string;
}

export interface DeleteOneUserReq {
  id: string;
}

export enum UserRole {
  CLIENT,
  ADMIN,
}
