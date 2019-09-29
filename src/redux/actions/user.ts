import { Picture } from "@/pages/advisory/Chat"
import { CurrSetPrescription } from "../reducers/user"

export const USER_LOGIN = "用户登录"
export const SAVE_CURR_SET_PRESCRIPTION = "存储当前开方信息"
export const DEL_CURR_SET_PRESCRIPTION = "删除当前开方信息"

export interface UserInfo {
  uid: number
  name: string
  avatar: Picture
}
export function userLogin(userInfo: UserInfo) {
  return {
    type: USER_LOGIN,
    preload: userInfo,
  }
}
export function saveCurrSetPrescription(preload: CurrSetPrescription) {
  return {
    type: SAVE_CURR_SET_PRESCRIPTION,
    preload,
  }
}
export function delCurrSetPrescription() {
  return {
    type: DEL_CURR_SET_PRESCRIPTION,
  }
}
