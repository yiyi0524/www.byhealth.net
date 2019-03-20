import { LocalStorage as storage, request as BuffReq } from "jsbdk";
import { BASE_URL } from "@config/api";
import qs from "qs";
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
  let isLogin = await new Promise(s => {
    try {
      bpost({
        url: "/isLogin",
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
    url: "/api/user/accountLogin",
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
    url: "/api/user/accountLogin",
    data: { phone, code, codeUuid },
  });
}
/**
 * 退出
 */
export async function logout() {
  return bget({
    url: "/user/logout",
  });
}

/**
 * 发送注册手机验证码
 */
export function sendPhoneRegisterVerifyCode({ phone }: { phone: string }) {
  return bpost({
    url: "/user/register/sendPhoneRegisterVerifyCode",
    data: {
      phone,
    },
  });
}
/**
 * 发送登录手机验证码
 */
export function getLoginPhoneVerifyCode({ phone }: { phone: string }) {
  return bpost({
    url: "/user/login/getLoginPhoneVerifyCode",
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
    url: "/user/getForgetPwdPhoneVerifyCode",
    data: {
      phone,
    },
  });
}
// /**
//  * 检查忘记密码手机验证码是否正确
//  */
// export function checkforGetPwdVerifyCode(phone, uuid, code) {
//   return request("/user/checkforGetPwdVerifyCode", { phone, uuid, code });
// }
// /**
//  * 已登录修改密码
//  */
// export function modifyPwd(oriPwd, pwd, rePwd) {
//   return request("/user/modifyPwd", { oriPwd, pwd, rePwd });
// }
/**
//  * 手机验证码修改密码
//  */
// export function modifyPwdWithPhoneCode(phone, uuid, code, pwd, rePwd) {
//   return request("/user/modifyPwdWithPhoneVerifyCode", { phone, uuid, code, pwd, rePwd });
// }
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
// export function uploadImg(file) {
//   let formData = new FormData();
//   formData.append("name", "idCard");
//   formData.append("idCard", {
//     uri: file.url,
//     name: "idcard.jpg",
//     type: "image/jpeg",
//   });
//   return buffFetch({
//     method: "POST",
//     url: BASE_URL + "/uploadImg",
//     body: formData,
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// }

export default {
  bget,
  bpost,
  isLogin,
  accountLogin,
  phoneLogin,
  logout,
  sendPhoneRegisterVerifyCode,
  getLoginPhoneVerifyCode,
  getForgetPwdPhoneVerifyCode,
  buildAliPayOrderInfo,
  buildWxPayOrderInfo,
  updateGetuiCid,
};
