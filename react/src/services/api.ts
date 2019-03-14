import { menuList } from '../config/menuList';
import { BASE_URL, antdUploadImgAction, } from "../config/prod";
import { request as BuffReq, LocalStorage as storage } from 'jsbdk';
import qs from 'qs';

export const getMenuList = () => {
  return menuList;
}
export const getUploadImgUrl = () => {
  return antdUploadImgAction;
}
const updateSessionTime = async () => {
  const adminIsLogin = storage.get('adminIsLogin')
  const userIsLogin = storage.get('userIsLogin')
  if (adminIsLogin === true) {
    storage.set('adminIsLogin', true, 15 * 60)
  }
  if (userIsLogin === true) {
    storage.set('userIsLogin', true, 15 * 60)
  }
  if (storage.has('uid') && (userIsLogin || adminIsLogin)) {
    storage.set('uid', storage.get('uid'), 15 * 60)
  }
  if (storage.has('nick') && (userIsLogin || adminIsLogin)) {
    storage.set('nick', storage.get('nick'), 15 * 60)
  }
}
export interface RequestParam {
  url: string,
  body?: any,
  query?: any,
  data?: any,
  method?: string,
}
export interface GetListParam {
  page?: number,
  limit?: number,
  filter?: object,
}
export async function request({ url, body = {}, method = 'POST' }: RequestParam) {
  updateSessionTime();
  return BuffReq(BASE_URL, url, body, method)
}
export async function bget({ url, query = {} }: RequestParam) {
  updateSessionTime();
  return BuffReq(BASE_URL, url + '?' + qs.stringify(query), null, 'GET')
}
export async function bpost({ url, data = {} }: RequestParam) {
  updateSessionTime();
  return BuffReq(BASE_URL, url, data)
}
export async function getRegion() {
  if (storage.has('region')) {
    return { data: { region: storage.get('region') } };
  }
  return bget({ url: "/getRegion", })
}
export async function antdUploadImg(formData: FormData) {
  return bpost({
    url: '/antdUploadImg', data: formData,
  })
}
export default {
  getUploadImgUrl,
  getRegion,
  antdUploadImg,
}
