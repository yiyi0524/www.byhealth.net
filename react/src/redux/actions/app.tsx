import appAction from '../constants/app';

export function adminLogin() {
  return {
    type: appAction.ADMIN_LOGIN,
  }
}
export function adminLogout() {
  return {
    type: appAction.ADMIN_LOGOUT,
  }
}
