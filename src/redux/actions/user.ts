export const USER_LOGIN = "用户登录";

export interface UserInfo {
  uid: number;
  name: string;
}
export function userLogin(userInfo: UserInfo) {
  return {
    type: USER_LOGIN,
    preload: userInfo,
  };
}
