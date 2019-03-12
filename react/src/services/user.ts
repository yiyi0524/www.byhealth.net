import { bpost, } from './api';

/**
 * 发送验证手机短信
 */
async function sendVerifyPhoneSms({ phone }: { phone: string }) {
  return bpost({
    url: 'user/sendVerifyPhoneSms', data: {
      phone,
    }
  })
}
/**
 * 验证手机(绑定手机号)
 */
async function verifyPhone({ code }: { code: string }) {
  return bpost({
    url: 'user/verifyPhone', data: {
      code,
    }
  })
}
export default {
  sendVerifyPhoneSms,
  verifyPhone,
}
