export interface UserEntity {
  id?: string;
  email: string;
  login: string;
  password: string;
  token?: string;
  activateToken?: string;
  isActive: 0 | 1;
}
