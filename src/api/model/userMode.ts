export interface RegisterUserInfo {
  username: string;
  password: string;
}

export interface LoginInfo {
  username: string;
  password: string;
  // captcha: string;
}

export const enum UserRole {
  admin = 'admin',
  user = 'user',
}

export interface UserInfo {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
  actived: boolean;
}

export interface CaptchaInfo {
  imgUrl: string;
}

export interface LoginResponse {
  token: string;
}
