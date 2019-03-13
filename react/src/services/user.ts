import { bpost, bget, GetListParam } from "./api";

/**
 * 登录方式
 */
export const LOGIN_TYPE = {
  ACCOUNT_LOGIN: 0x0,
  PHONE_VERIFY_CODE_LOGIN: 0x1,
  EMAIL_VERIFY_CODE_LOGIN: 0x2
};
export const REGISTER_TYPE = {
  ACCOUNT_REGISTER: 0x0,
  PHONE_VERIFY_CODE_REGISTER: 0x1,
  EMAIL_VERIFY_CODE_REGISTER: 0x2
};
export const GENDER = {
  UNDEFINED: 0,
  MAN: 1,
  WOMAN: 2
};
export const GENDER_ZH = ["未知", "男", "女"];

export const NOT_LIMIT = -1;

/**
 * 发送验证手机短信
 */
async function sendVerifyPhoneSms({ phone }: { phone: string }) {
  return bpost({
    url: "user/sendVerifyPhoneSms",
    data: {
      phone
    }
  });
}
/**
 * 验证手机(绑定手机号)
 */
async function verifyPhone({ code }: { code: string }) {
  return bpost({
    url: "user/verifyPhone",
    data: {
      code
    }
  });
}

export async function getList({
  page = -1,
  limit = -1,
  filter = {}
}: GetListParam) {
  return bget({
    url: "/userList",
    query: {
      page,
      limit,
      filter
    }
  });
}
export interface RegisterParam {
  uname: string;
  pwd: string;
  rePwd: string;
  registerType: number;
  phone?: string;
  phoneVerifyCode?: string;
  email?: string;
  emailVerifyCode?: string;
}
export async function register({
  uname,
  pwd,
  rePwd,
  registerType,
  phone = "",
  phoneVerifyCode = "",
  email = "",
  emailVerifyCode = ""
}: RegisterParam) {
  return bpost({
    url: "/user/register",
    data: {
      uname,
      pwd,
      phone,
      rePwd,
      phoneVerifyCode,
      email,
      emailVerifyCode,
      registerType
    }
  });
}
export interface LoginParam {
  type: number;
  account?: string;
  pwd?: string;
  accountVerifyCode?: string;
  rememberAccountPwd?: boolean;
  email?: string;
  emailVerifyCode?: string;
  rememberEmailPwd?: boolean;
  phone?: string;
  phoneVerifyCode?: string;
  rememberPhonePwd?: boolean;
}
export async function userLogin({
  type,
  account,
  pwd,
  accountVerifyCode,
  rememberAccountPwd,
  email,
  emailVerifyCode,
  rememberEmailPwd,
  phone,
  phoneVerifyCode,
  rememberPhonePwd
}: LoginParam) {
  switch (type) {
    case LOGIN_TYPE.ACCOUNT_LOGIN:
      return userAccountLogin({
        account: account as string,
        pwd: pwd as string,
        accountVerifyCode: accountVerifyCode as string,
        rememberPwd: rememberAccountPwd as boolean
      });
    case LOGIN_TYPE.EMAIL_VERIFY_CODE_LOGIN:
      return userEmailLogin({
        email: email as string,
        emailVerifyCode: emailVerifyCode as string,
        rememberPwd: rememberEmailPwd as boolean
      });
    case LOGIN_TYPE.PHONE_VERIFY_CODE_LOGIN:
      return userPhoneLogin({
        phone: phone as string,
        phoneVerifyCode: phoneVerifyCode as string,
        rememberPwd: rememberPhonePwd as boolean
      });
    default:
      return Promise.reject("登录方式不正确");
  }
}
interface UserAccountLoginParam {
  account: string;
  pwd: string;
  accountVerifyCode: string;
  rememberPwd: boolean;
}
async function userAccountLogin({
  account,
  pwd,
  accountVerifyCode,
  rememberPwd = false
}: UserAccountLoginParam) {
  return bpost({
    url: "user/login",
    data: {
      loginType: LOGIN_TYPE.ACCOUNT_LOGIN,
      account,
      pwd,
      accountVerifyCode,
      rememberPwd
    }
  });
}
interface UserEmailLoginParam {
  email: string;
  emailVerifyCode: string;
  rememberPwd: boolean;
}
async function userEmailLogin({
  email,
  emailVerifyCode,
  rememberPwd
}: UserEmailLoginParam) {
  return bpost({
    url: "user/login",
    data: {
      loginType: LOGIN_TYPE.EMAIL_VERIFY_CODE_LOGIN,
      email,
      emailLoginVerifyCode: emailVerifyCode,
      rememberPwd
    }
  });
}
interface UserPhoneLoginParam {
  phone: string;
  phoneVerifyCode: string;
  rememberPwd: boolean;
}
async function userPhoneLogin({
  phone,
  phoneVerifyCode,
  rememberPwd
}: UserPhoneLoginParam) {
  return bpost({
    url: "user/login",
    data: {
      loginType: LOGIN_TYPE.PHONE_VERIFY_CODE_LOGIN,
      phone,
      phoneLoginVerifyCode: phoneVerifyCode,
      rememberPwd
    }
  });
}

export async function adminLogin({
  type,
  account,
  pwd,
  accountVerifyCode,
  rememberAccountPwd,
  email,
  emailVerifyCode,
  rememberEmailPwd,
  phone,
  phoneVerifyCode,
  rememberPhonePwd
}: LoginParam) {
  switch (type) {
    case LOGIN_TYPE.ACCOUNT_LOGIN:
      return adminAccountLogin({
        account: account as string,
        pwd: pwd as string,
        accountVerifyCode: accountVerifyCode as string,
        rememberPwd: rememberAccountPwd as boolean
      });
    case LOGIN_TYPE.EMAIL_VERIFY_CODE_LOGIN:
      return adminEmailLogin({
        email: email as string,
        emailVerifyCode: emailVerifyCode as string,
        rememberPwd: rememberEmailPwd as boolean
      });
    case LOGIN_TYPE.PHONE_VERIFY_CODE_LOGIN:
      return adminPhoneLogin({
        phone: phone as string,
        phoneVerifyCode: phoneVerifyCode as string,
        rememberPwd: rememberPhonePwd as boolean
      });
    default:
      return Promise.reject("登录方式不正确");
  }
}
async function adminAccountLogin({
  account,
  pwd,
  accountVerifyCode,
  rememberPwd = false
}: UserAccountLoginParam) {
  return bpost({
    url: "admin/login",
    data: {
      loginType: LOGIN_TYPE.ACCOUNT_LOGIN,
      account,
      pwd,
      accountVerifyCode,
      rememberPwd
    }
  });
}
async function adminEmailLogin({
  email,
  emailVerifyCode,
  rememberPwd
}: UserEmailLoginParam) {
  return bpost({
    url: "admin/login",
    data: {
      loginType: LOGIN_TYPE.EMAIL_VERIFY_CODE_LOGIN,
      email,
      emailLoginVerifyCode: emailVerifyCode,
      rememberPwd
    }
  });
}
async function adminPhoneLogin({
  phone,
  phoneVerifyCode,
  rememberPwd
}: UserPhoneLoginParam) {
  return bpost({
    url: "admin/login",
    data: {
      loginType: LOGIN_TYPE.PHONE_VERIFY_CODE_LOGIN,
      phone,
      phoneLoginVerifyCode: phoneVerifyCode,
      rememberPwd
    }
  });
}
export interface ModifyPwdParam {
  oriPwd: string;
  newPwd: string;
  rePwd: string;
}
//修改密码
export async function modifyPwd({ oriPwd, newPwd, rePwd }: ModifyPwdParam) {
  return bpost({
    url: "/modifyPwd",
    data: { oriPwd, newPwd, rePwd }
  });
}

//退出
export async function logout() {
  return bget({
    url: "/logout"
  });
}
interface AddUserParam {
  account: string;
  pwd: string;
  rePwd: string;
  nick: string;
  email: string;
  phone: string;
  isAdmin: string;
  profile: string;
}
//添加用户
export async function addUser({
  account,
  pwd,
  rePwd,
  nick,
  email,
  phone,
  isAdmin,
  profile
}: AddUserParam) {
  return bpost({
    url: "/addUser",
    data: {
      account,
      pwd,
      rePwd,
      nick,
      email,
      phone,
      isAdmin,
      profile
    }
  });
}

export default {
  sendVerifyPhoneSms,
  verifyPhone,
  addUser,
  logout,
  adminLogin,
  userLogin,
  getList
};
