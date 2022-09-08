import { UserRole } from "./user";

export interface UserEntity {
  id?: string;
  email: string;
  login: string;
  password: string;
  token?: string;
  role: UserRole;
  //TODO activateToken?: string;
  //TODO isActive: 0 | 1;
}
