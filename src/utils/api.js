import storage from './storage';
import buffFetch from './fetch';
import { BASE_URL } from './config';
import * as juiceApiOri from './juiceApi';
import { Platform } from 'react-native';
export async function isLogin() {
  let session = await storage.get('session');
  if (!session) {
    return false;
  }
  let isLogin = await new Promise(s => {
    try {
      buffFetch({
        method: "POST",
        url: BASE_URL + '/isLogin',
        headers: {
          session,
          'content-type': 'application/json',
        },
      }).then(_ => s(true)).catch(_ => s(false))
    } catch (err) {
      s(false)
    }
  })
  return isLogin;
}
/**
 * 账号登录
 */
export async function accountLogin(account, pwd) {
  return buffFetch({
    method: "POST",
    url: BASE_URL + '/api/user/accountLogin',
    body: JSON.stringify({
      account,
      pwd,
    }),
    headers: {
      'content-type': 'application/json',
    },
  })
}
/**
 * 手机号码登录
 */
export async function phoneLogin(phone, code, codeUuid) {
  return buffFetch({
    method: "POST",
    url: BASE_URL + '/api/user/phoneLogin',
    body: JSON.stringify({
      phone,
      code,
      codeUuid,
    }),
    headers: {
      'content-type': 'application/json',
    },
  })
}
export async function request(url, body) {
  let session = await storage.get('session')
  return buffFetch({
    method: "POST",
    url: BASE_URL + "/api" + url,
    body: JSON.stringify(body),
    headers: {
      session: session,
      'content-type': 'application/json',
    },
  })
}
/**
 * 获取今日新增优质客户数量
 */
export async function getTodayNewGreetCustomerCount() {
  return request('/common/getTodayNewGreetCustomerCount')
}

/**
 * 获取个人中心的数据
 */
export function getPersonalData() {
  return request('/user/getPersonalData')
}
/**
 * 退出
 */
export function logout() {
  return request('/user/logout')
}

/**
 * 获取 用户信息
 */
export function getUserImformation() {
  return request('/user/imformation')
}
/**
 * 用户注册
 */
export function register({ account, pwd, verifyCode, phone, verifyCodeUuid, }) {
  return request('/user/register', { account, pwd, verifyCode, phone, verifyCodeUuid, })
}
/**
 * 发送注册手机验证码
 */
export function getVerifyCode({ phone, }) {
  return request('/user/getRegisterPhoneVerifyCode', { phone, })
}
/**
 * 发送登录手机验证码
 */
export function getLoginVerifyCode({ phone, }) {
  return request('/user/getLoginPhoneVerifyCode', { phone, })
}
/**
 * 发送忘记密码手机验证码
 */
export function getForgetPwdVerifyCode({ phone, }) {
  return request('/user/getForgetPwdVerifyCode', { phone, })
}

/**
 * 购买商品
 */
export function buyGoods(goodsId) {
  return request('/goods/buy', { id: goodsId, })
}
/**
 * 购买商品
 */
export function sendFeedback(feedback) {
  return request('/user/feedback', { feedback, })
}
/**
 * 获取余额
 */
export function getBalance() {
  return request('/user/balance')
}
/**
 * 获取会员信息
 */
export function getVipInfo() {
  return request('/user/vipInfo')
}

/**
 * 获取会员信息
 */
export function getVipRechargePageData() {
  return request('/user/vipRechargePageData')
}
/**
 * 购买会员
 */
export function buyVip(chooseVipGoodsKey) {
  return request('/user/buyVip', { chooseVipGoodsKey })
}
/**
 * 检查忘记密码手机验证码是否正确
 */
export function checkforGetPwdVerifyCode(phone, uuid, code) {
  return request('/user/checkforGetPwdVerifyCode', { phone, uuid, code })
}
/**
 * 已登录修改密码
 */
export function modifyPwd(oriPwd, pwd, rePwd) {
  return request('/user/modifyPwd', { oriPwd, pwd, rePwd })
}
/**
 * 手机验证码修改密码
 */
export function modifyPwdWithPhoneCode(phone, uuid, code, pwd, rePwd) {
  return request('/user/modifyPwdWithPhoneVerifyCode', { phone, uuid, code, pwd, rePwd })
}
/**
 * 获取海报
 */
export function getPoster(id) {
  return request('/poster/detail', { id })
}
/**
 * 获取海报
 */
export function getMyInvoteInfo() {
  return request('/user/invoteInfo')

}
/**
 * 获取用户实名状态详情
 */
export function getRealNameAuthDetail() {
  return request('/user/realNameDetail')

}
/**
 * 返回用户是否已登录
 */
export function getUserHasRealNameAuth() {
  return new Promise(s => {
    request('/user/userHasRealNameAuth').then(json => {
      s(json.data.hasRealNameAuth)
    }).catch(err => {
      s(false)
    })
  })

}
/**
* 实名认证
*/
export function realNameAuth({ name,
  idCard,
  idCardImg0,
  idCardImg1,
  employeeCardPic }) {
  return request('/user/realNameAuth', {
    name,
    idCard,
    idCardImg0,
    idCardImg1,
    employeeCardPic,
  })
}
/**
 * 获取支付宝支付订单信息
 */
export function buildAliPayOrderInfo({ body,
  subject,
  money, }) {
  return request('/ali_pay/buildOrderInfo', {
    body,
    subject,
    money,
  })
}
/**
 * 更新用户个推cid
 */
export function updateGetuiCid(cid) {
  return request('/user/updateGetuiCid', {
    cid,
  })
}
/**
 * 上传图片
 */
export function uploadImg(file) {
  let formData = new FormData();
  formData.append('name', "idCard")
  formData.append("idCard", {
    uri: file.url,
    name: "idcard.jpg",
    type: 'image/jpeg',
  });
  return buffFetch({
    method: "POST",
    url: BASE_URL + "/uploadImg",
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
export async function isCheckMode() {
  let isCheckMode = true;
  try {
    let json = await request('/isCheckMode');
    isCheckMode = json.data.isCheckMode;
  } catch (e) {
    isCheckMode = true;
  }
  if (Platform.OS === 'android') {
    isCheckMode = false;
  }
  // console.log(isCheckMode)
  return isCheckMode;
}
export const juiceApi = juiceApiOri;

export default {
  isCheckMode,
  isLogin,
  accountLogin,
  getLoginVerifyCode,
  request,
  getTodayNewGreetCustomerCount,
  getPersonalData,
  logout,
  buyGoods,
  phoneLogin,
  sendFeedback,
  getBalance,
  getVipInfo,
  getVipRechargePageData,
  buyVip,
  getForgetPwdVerifyCode,
  checkforGetPwdVerifyCode,
  modifyPwd,
  modifyPwdWithPhoneCode,
  getPoster,
  getMyInvoteInfo,
  uploadImg,
  realNameAuth,
  getUserHasRealNameAuth,
  buildAliPayOrderInfo,
  updateGetuiCid,
}
