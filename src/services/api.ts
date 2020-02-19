import { BASE_URL } from '@config/api'
import storage from '@utils/storage'
import idCard from 'idcard'
import { request as BuffReq } from 'jsbdk'
import qs from 'qs'
import { AppStateStatus, Dimensions, Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'
export const JsonReturnCode = {
  SUCCESS: 0x0,
}
export const NOT_LIMIT = -1
export const windowWidth = Dimensions.get('window').width
export const windowHeight = Dimensions.get('window').height
export const TYPE = {
  undefined: -1,
  //数值
  eq: 0x0,
  lt: 0x1,
  gt: 0x2,
  neq: 0x3,
  betweenValue: 0x4,
  //字符串
  eqString: 0x5,
  like: 0x6,
  notLike: 0x7,
  before: 0x8,
  after: 0x9,
  betweenTime: 0xa,
  //数组
  in: 0xb,
  notIn: 0xc,
  neqString: 0xd,
}
export const TYPE_ZH = {
  [TYPE.undefined]: '未定义',
  //数值比较
  [TYPE.eq]: '等于',
  [TYPE.lt]: '小于',
  [TYPE.gt]: '大于',
  [TYPE.neq]: '不等于',
  [TYPE.betweenValue]: '在什么值之间',
  //字符串比较
  [TYPE.eqString]: '等于',
  [TYPE.like]: '包含',
  [TYPE.notLike]: '不包含',
  //日期
  [TYPE.before]: '在什么日期之前',
  [TYPE.after]: '在什么日期之后',
  [TYPE.betweenTime]: '在什么日期之间',
  //数组
  [TYPE.in]: '在数组中',
  [TYPE.notIn]: '不在数组中',
  [TYPE.neqString]: '不等于',
}
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
export async function bget<T = any>({ url, query = {}, headers = {} }: RequestParam) {
  let session = await storage.get('session')
  headers.session = session
  headers['content-type'] = 'application/json'
  return BuffReq<T>(BASE_URL, url + '?' + qs.stringify(query), null, 'GET', 'include', headers)
}
export async function bpost<T = any>({ url, data = {}, headers = {} }: RequestParam) {
  let session = await storage.get('session')
  headers.session = session
  headers['content-type'] = 'application/json'
  return BuffReq<T>(BASE_URL, url, data, 'POST', 'include', headers)
}
export async function isLogin() {
  let session = await storage.get('session')
  if (!session) {
    console.log('session 不存在 未登录')
    return false
  }
  let userIsLogin: boolean = await new Promise(s => {
    try {
      bpost({
        url: '/api/isLogin',
      })
        .then(() => {
          console.log('s true')
          s(true)
        })
        .catch(err => {
          if (err.msg && err.msg.includes('Network request failed')) {
            s(true)
          } else {
            s(false)
          }
        })
    } catch (err) {
      console.log('check isLogin err: ', err)
      s(false)
    }
  })
  if (!userIsLogin) {
    console.log('not login: ', session)
  }
  return userIsLogin
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
    url: '/api/accountLogin',
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
    url: '/api/phoneLogin',
    data: { phone, code, codeUuid },
  })
}
/**
 * 退出
 */
export async function logout() {
  return bget({
    url: '/api/logout',
  })
}

/**
 * 发送注册手机验证码
 */
export function sendPhoneRegisterVerifyCode({ phone }: { phone: string }) {
  return bpost({
    url: '/api/sendPhoneRegisterVerifyCode',
    data: {
      phone,
    },
  })
}
export interface registerParam {
  smsUuid: string
  verifyCode: string
  name: string
  pwd: string
  rePwd: string
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
  pwd,
  rePwd,
  phone,
  countyCid,
  hospitalId,
  hospitalName,
}: registerParam) {
  return bpost({
    url: '/api/register',
    data: {
      smsUuid,
      verifyCode,
      name,
      pwd,
      rePwd,
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
    url: '/api/getLoginPhoneVerifyCode',
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
    url: '/api/getForgetPwdPhoneVerifyCode',
    data: {
      phone,
    },
  })
}
/**
 * 检查忘记密码手机验证码是否正确
 */
export function checkforGetPwdVerifyCode({ phone, uuid, code }: { phone: string; uuid: string; code: string }) {
  return bpost({
    url: '/api/checkForgetPwdVerifyCode',
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
export function modifyPwd({ oriPwd, pwd, rePwd }: { oriPwd: string; pwd: string; rePwd: string }) {
  return bpost({ url: '/api/modifyPwd', data: { oriPwd, pwd, rePwd } })
}
/**
 * 发送修改密码手机验证码
 */
export function getmodifyPwdWithPhoneCode({ phone }: { phone: string }) {
  return bpost({
    url: '/api/getmodifyPwdWithPhoneCode',
    data: {
      phone,
    },
  })
}
/**
 * 手机验证码修改密码
 */
export function modifyPwdWithOriPwd({ oriPwd, newPwd, rePwd }: { oriPwd: string; newPwd: string; rePwd: string }) {
  return bpost({
    url: 'api/modifyPwdWithOriPwd',
    data: { oriPwd, newPwd, rePwd },
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
export function buildAliPayOrderInfo({ body, subject, money }: AliPayOrderInfo) {
  return bpost({
    url: '/ali_pay/buildOrderInfo',
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
export function buildWxPayOrderInfo({ body, detail, attach, money }: WxPayOrderInfo) {
  return bpost({
    url: '/ali_pay/buildOrderInfo',
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
    url: '/user/updateGetuiCid',
    data: {
      cid,
    },
  })
}
/**
 * 更新用户阿里云推送deviceId
 */
export function updateAliPushDeviceId(data: { deviceId: string }) {
  return bpost({
    url: '/user/updateAliPushDeviceId',
    data: {
      ...data,
      os: Platform.OS,
    },
  })
}
/**
 * 更新用户阿里云推送deviceId
 */
export function updateAppStateStatus(data: { status: AppStateStatus }) {
  return bpost({
    url: '/user/updateAppStateStatus',
    data,
  })
}
// /**
//  * 上传图片
//  */
export function uploadImg(file: any) {
  let formData = new FormData()
  formData.append('name', 'file')
  formData.append('file', {
    // @ts-ignore
    uri: file.url,
    name: 'file.jpg',
    type: 'image/jpeg',
  })
  return BuffReq(BASE_URL, '/uploadImg', formData, 'POST', 'include', {
    'Content-Type': 'multipart/form-data',
  })
}

/**
 * 获取省市区
 */
export function getRegion() {
  return bget({
    url: '/getRegion',
  })
}
/**
 * 获取医疗机构
 */
export function getMedicalInstitutions(cityId: any) {
  return bpost({
    url: '/common/getMedicalInstitutions',
    data: {
      cityId,
    },
  })
}
export function idCardIDChecked(sId: string) {
  return Boolean(idCard.verify(sId))
}
/**
 * 获取缩略图url
 */
export function getThumbUrl({ path, width = 400 }: { width?: number; path: string }) {
  // 如果不是我们服务器的图片就不转换,比如微信
  if (path.indexOf('http') === 0 && path.indexOf(BASE_URL) !== 0) {
    return path
  }
  return BASE_URL + `/getThumb?path=${path}&width=${width}`
}
/**
 * 检查更新
 */
export function checkUpdate() {
  return bget<{ needUpdate: boolean; updateUrl: string; forceUpdate: boolean }>({
    url: '/app/checkUpdate',
    query: {
      os: Platform.OS,
      version: DeviceInfo.getVersion(),
    },
  })
}
export interface FileRes {
  fileId: number
  name: string
  url: string
}
/**
 * 上传音频
 */
export function uploadAudio(uri: string) {
  let formData = new FormData()
  formData.append('name', 'file')
  formData.append('file', {
    // @ts-ignore
    uri,
    name: 'file.aac',
    type: 'audio/x-aac',
  })
  return BuffReq<FileRes>(BASE_URL, '/uploadAudio', formData, 'POST', 'include', {
    'Content-Type': 'multipart/form-data',
  })
}
export default {
  checkUpdate,
  getThumbUrl,
  uploadImg,
  uploadAudio,
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
  modifyPwdWithOriPwd,
}
