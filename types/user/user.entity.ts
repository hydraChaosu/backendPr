export interface UserEntity {
  id?: string;
  email: string;
  login: string;
  password: string;
  token?: string;
  //TODO activateToken?: string;
  //TODO isActive: 0 | 1;
}
