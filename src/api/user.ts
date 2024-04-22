import type { CaptchaInfo, LoginInfo, LoginResponse, RegisterUserInfo, UserInfo } from '@/api/model';
import { request } from '@/utils/request';

const Api = {
  Captcha: '/user/captcha',
  Register: '/user/register',
  Login: '/user/login',
  GetUserInfo: '/user',
};

export function register(payload: RegisterUserInfo) {
  return request.post<UserInfo>({
    url: Api.Register,
    data: payload,
  });
}

export function getCaptcha() {
  return request.get<CaptchaInfo>({
    url: Api.Captcha,
  });
}

export function login(payload: LoginInfo) {
  return request.post<LoginResponse>({
    url: Api.Login,
    data: payload,
  });
}

export function getUserInfo() {
  return request.get<UserInfo>({
    url: Api.GetUserInfo,
  });
}
