export const ADMIN_LOGIN = "管理员登录";
export const ADMIN_LOGOUT = "管理员退出";

export interface AdminLoginPreload {
  uid: number;
  nick: string;
}
export function login(preload: AdminLoginPreload) {
  return {
    type: ADMIN_LOGIN,
    preload
  };
}
export function logout() {
  return {
    type: ADMIN_LOGOUT
  };
}
