import { request as BuffReq } from "jsbdk";
import { Dimensions } from "react-native";
import { BASE_URL } from "@config/api";
import storage from "@utils/storage";
import qs from "qs";
export const windowWidth = Dimensions.get("window").width;
export const windowHeight = Dimensions.get("window").height;
export interface RequestParam {
  url: string;
  body?: any;
  query?: any;
  data?: any;
  method?: string;
  headers?: Record<string, string>;
}
export interface GetListParam {
  page?: number;
  limit?: number;
  filter?: object;
}
export async function bget({ url, query = {}, headers = {} }: RequestParam) {
  let session = await storage.get("session");
  headers["session"] = session;
  headers["content-type"] = "application/json";
  return BuffReq(BASE_URL, url + "?" + qs.stringify(query), null, "GET", "include", headers);
}
export async function bpost({ url, data = {}, headers = {} }: RequestParam) {
  let session = await storage.get("session");
  headers["session"] = session;
  headers["content-type"] = "application/json";
  return BuffReq(BASE_URL, url, data, "POST", "include", headers);
}
export async function isLogin() {
  let session = await storage.get("session");
  if (!session) {
    return false;
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
        .catch(() => s(false));
    } catch (err) {
      s(false);
    }
  });
  return isLogin;
}
export interface AccountLoginParam {
  account: string;
  pwd: string;
}
/**
 * 账号登录
 */
export async function accountLogin({ account, pwd }: AccountLoginParam) {
  return bpost({
    url: "/api/accountLogin",
    data: { account, pwd },
  });
}
export interface PhoneLoginParam {
  phone: string;
  code: string;
  codeUuid: string;
}
/**
 * 手机号码登录
 */
export async function phoneLogin({ phone, code, codeUuid }: PhoneLoginParam) {
  return bpost({
    url: "/api/phoneLogin",
    data: { phone, code, codeUuid },
  });
}
/**
 * 退出
 */
export async function logout() {
  return bget({
    url: "/api/logout",
  });
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
  });
}
export interface registerParam {
  smsUuid: string;
  verifyCode: string;
  name: string;
  phone: string;
  countyCid: string;
  hospitalId?: number;
  hospitalName?: string;
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
  });
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
  });
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
  });
}
/**
 * 检查忘记密码手机验证码是否正确
 */
export function checkforGetPwdVerifyCode({
  phone,
  uuid,
  code,
}: {
  phone: string;
  uuid: string;
  code: string;
}) {
  return bpost({
    url: "/api/checkForgetPwdVerifyCode",
    data: {
      phone,
      uuid,
      code,
    },
  });
}
/**
 * 已登录修改密码
 */
export function modifyPwd({ oriPwd, pwd, rePwd }: { oriPwd: string; pwd: string; rePwd: string }) {
  return bpost({ url: "/api/modifyPwd", data: { oriPwd, pwd, rePwd } });
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
  phone: string;
  uuid: string;
  code: string;
  pwd: string;
  rePwd: string;
}) {
  return bpost({
    url: "/api/modifyPwdWithPhoneVerifyCode",
    data: { phone, uuid, code, pwd, rePwd },
  });
}
export interface AliPayOrderInfo {
  body: string;
  subject: string;
  money: number;
}
/**
 * 获取支付宝支付订单信息
 */
export function buildAliPayOrderInfo({ body, subject, money }: AliPayOrderInfo) {
  return bpost({
    url: "/ali_pay/buildOrderInfo",
    data: {
      body,
      subject,
      money,
    },
  });
}
export interface WxPayOrderInfo {
  body: string;
  detail: string;
  attach: string;
  money: number;
}
/**
 * 获取微信支付订单信息
 */
export function buildWxPayOrderInfo({ body, detail, attach, money }: WxPayOrderInfo) {
  return bpost({
    url: "/ali_pay/buildOrderInfo",
    data: {
      body,
      detail,
      attach,
      money,
    },
  });
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
  });
}
// /**
//  * 上传图片
//  */
export function uploadImg(file: any) {
  let formData = new FormData();
  formData.append("name", "file");
  formData.append("file", {
    uri: file.url,
    name: "file.jpg",
    type: "image/jpeg",
  });
  return BuffReq(BASE_URL, "/uploadImg", formData, "POST", "include", {
    "Content-Type": "multipart/form-data",
  });
}

/**
 * 获取省市区
 */
export function getRegion() {
  return bget({
    url: "/getRegion",
  });
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
  });
}
/**
 * 获取消息列表
 */
export function getInformationList() {
  return bget({
    url: "/information/getInformationList",
  });
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
  getInformationList,
};
