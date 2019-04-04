import { request as BuffReq } from "jsbdk"
import { Dimensions } from "react-native"
import { BASE_URL } from "@config/api"
import storage from "@utils/storage"
import qs from "qs"
export const windowWidth = Dimensions.get("window").width
export const windowHeight = Dimensions.get("window").height
export interface RequestParam {
  url: string
  body?: any
  query?: any
  data?: any
  method?: string
  headers?: Record<string, string>
}

export interface GetListParam {
  page?: number
  limit?: number
  filter?: object
}
export async function bget<T = any>({
  url,
  query = {},
  headers = {},
}: RequestParam) {
  let session = await storage.get("session")
  headers["session"] = session
  headers["content-type"] = "application/json"
  return BuffReq<T>(
    BASE_URL,
    url + "?" + qs.stringify(query),
    null,
    "GET",
    "include",
    headers,
  )
}
export async function bpost<T = any>({
  url,
  data = {},
  headers = {},
}: RequestParam) {
  let session = await storage.get("session")
  headers["session"] = session
  headers["content-type"] = "application/json"
  return BuffReq<T>(BASE_URL, url, data, "POST", "include", headers)
}
export async function isLogin() {
  let session = await storage.get("session")
  if (!session) {
    return false
  }
  let isLogin: boolean = await new Promise(s => {
    try {
      bpost({
        url: "/api/isLogin",
        headers: {
          session,
        },
      })
        .then(() => s(true))
        .catch(() => s(false))
    } catch (err) {
      s(false)
    }
  })
  return isLogin
}
export interface AccountLoginParam {
  account: string
  pwd: string
}
/**
 * 账号登录
 */
export async function accountLogin({ account, pwd }: AccountLoginParam) {
  return bpost({
    url: "/api/accountLogin",
    data: { account, pwd },
  })
}
export interface PhoneLoginParam {
  phone: string
  code: string
  codeUuid: string
}
/**
 * 手机号码登录
 */
export async function phoneLogin({ phone, code, codeUuid }: PhoneLoginParam) {
  return bpost({
    url: "/api/phoneLogin",
    data: { phone, code, codeUuid },
  })
}
/**
 * 退出
 */
export async function logout() {
  return bget({
    url: "/api/logout",
  })
}

/**
 * 发送注册手机验证码
 */
export function sendPhoneRegisterVerifyCode({ phone }: { phone: string }) {
  return bpost({
    url: "/api/sendPhoneRegisterVerifyCode",
    data: {
      phone,
    },
  })
}
export interface registerParam {
  smsUuid: string
  verifyCode: string
  name: string
  phone: string
  countyCid: string
  hospitalId?: number
  hospitalName?: string
}
/**
 * 注册
 */
export function register({
  smsUuid,
  verifyCode,
  name,
  phone,
  countyCid,
  hospitalId,
  hospitalName,
}: registerParam) {
  return bpost({
    url: "/api/register",
    data: {
      smsUuid,
      verifyCode,
      name,
      phone,
      countyCid,
      hospitalId,
      hospitalName,
    },
  })
}
/**
 * 发送登录手机验证码
 */
export function getLoginPhoneVerifyCode({ phone }: { phone: string }) {
  return bpost({
    url: "/api/getLoginPhoneVerifyCode",
    data: {
      phone,
    },
  })
}
/**
 * 发送忘记密码手机验证码
 */
export function getForgetPwdPhoneVerifyCode({ phone }: { phone: string }) {
  return bpost({
    url: "/api/getForgetPwdPhoneVerifyCode",
    data: {
      phone,
    },
  })
}
/**
 * 检查忘记密码手机验证码是否正确
 */
export function checkforGetPwdVerifyCode({
  phone,
  uuid,
  code,
}: {
  phone: string
  uuid: string
  code: string
}) {
  return bpost({
    url: "/api/checkForgetPwdVerifyCode",
    data: {
      phone,
      uuid,
      code,
    },
  })
}
/**
 * 已登录修改密码
 */
export function modifyPwd({
  oriPwd,
  pwd,
  rePwd,
}: {
  oriPwd: string
  pwd: string
  rePwd: string
}) {
  return bpost({ url: "/api/modifyPwd", data: { oriPwd, pwd, rePwd } })
}
/**
 * TODO
 * 发送修改密码手机验证码
 */
export function getmodifyPwdWithPhoneCode({ phone }: { phone: string }) {
  return bpost({
    url: "/api/getmodifyPwdWithPhoneCode",
    data: {
      phone,
    },
  })
}
/**
 * 手机验证码修改密码
 */
export function modifyPwdWithPhoneCode({
  phone,
  uuid,
  code,
  pwd,
  rePwd,
}: {
  phone: string
  uuid: string
  code: string
  pwd: string
  rePwd: string
}) {
  return bpost({
    url: "/api/modifyPwdWithPhoneVerifyCode",
    data: { phone, uuid, code, pwd, rePwd },
  })
}
export interface AliPayOrderInfo {
  body: string
  subject: string
  money: number
}
/**
 * 获取支付宝支付订单信息
 */
export function buildAliPayOrderInfo({
  body,
  subject,
  money,
}: AliPayOrderInfo) {
  return bpost({
    url: "/ali_pay/buildOrderInfo",
    data: {
      body,
      subject,
      money,
    },
  })
}
export interface WxPayOrderInfo {
  body: string
  detail: string
  attach: string
  money: number
}
/**
 * 获取微信支付订单信息
 */
export function buildWxPayOrderInfo({
  body,
  detail,
  attach,
  money,
}: WxPayOrderInfo) {
  return bpost({
    url: "/ali_pay/buildOrderInfo",
    data: {
      body,
      detail,
      attach,
      money,
    },
  })
}
/**
 * 更新用户个推cid
 */
export function updateGetuiCid(cid: string) {
  return bpost({
    url: "/user/updateGetuiCid",
    data: {
      cid,
    },
  })
}
// /**
//  * 上传图片
//  */
export function uploadImg(file: any) {
  let formData = new FormData()
  formData.append("name", "file")
  formData.append("file", {
    uri: file.url,
    name: "file.jpg",
    type: "image/jpeg",
  })
  return BuffReq(BASE_URL, "/uploadImg", formData, "POST", "include", {
    "Content-Type": "multipart/form-data",
  })
}

/**
 * 获取省市区
 */
export function getRegion() {
  return bget({
    url: "/getRegion",
  })
}
/**
 * 获取医疗机构
 */
export function getMedicalInstitutions(cityId: any) {
  return bpost({
    url: "/common/getMedicalInstitutions",
    data: {
      cityId,
    },
  })
}
let aCity = {
  11: "北京",
  12: "天津",
  13: "河北",
  14: "山西",
  15: "内蒙古",
  21: "辽宁",
  22: "吉林",
  23: "黑龙江",
  31: "上海",
  32: "江苏",
  33: "浙江",
  34: "安徽",
  35: "福建",
  36: "江西",
  37: "山东",
  41: "河南",
  42: "湖北",
  43: "湖南",
  44: "广东",
  45: "广西",
  46: "海南",
  50: "重庆",
  51: "四川",
  52: "贵州",
  53: "云南",
  54: "西藏",
  61: "陕西",
  62: "甘肃",
  63: "青海",
  64: "宁夏",
  65: "新疆",
  71: "台湾",
  81: "香港",
  82: "澳门",
  91: "国外",
}
export function idCardIDChecked(sId: string) {
  var iSum = 0
  var info = ""
  if (!/^\d{17}(\d|x)$/i.test(sId)) return false
  sId = sId.replace(/x$/i, "a")
  if (aCity[parseInt(sId.substr(0, 2))] === null) return false
  var sBirthday =
    sId.substr(6, 4) +
    "-" +
    Number(sId.substr(10, 2)) +
    "-" +
    Number(sId.substr(12, 2))
  var d = new Date(sBirthday.replace(/-/g, "/"))
  if (
    sBirthday !==
    d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
  )
    return false
  for (var i = 17; i >= 0; i--)
    iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11)
  if (iSum % 11 !== 1) return false
  return true
}
export default {
  uploadImg,
  bget,
  bpost,
  isLogin,
  register,
  accountLogin,
  phoneLogin,
  logout,
  sendPhoneRegisterVerifyCode,
  getLoginPhoneVerifyCode,
  getForgetPwdPhoneVerifyCode,
  buildAliPayOrderInfo,
  buildWxPayOrderInfo,
  updateGetuiCid,
  getRegion,
  getMedicalInstitutions,
  idCardIDChecked,
  getmodifyPwdWithPhoneCode,
  modifyPwdWithPhoneCode,
}
