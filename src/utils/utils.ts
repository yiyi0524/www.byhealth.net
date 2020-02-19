import { Platform, Dimensions, NativeModules, Text, TextInput } from 'react-native'
import { BASE_URL, CDN_BASE_URL } from '@/config/api'
const notFound = -1
const zeroPos = 0
const os = Platform.OS
export const isAndroid = os === 'android'
export const isIos = os === 'ios'
export const windowWidth = Dimensions.get('window').width
export const windowHeight = Dimensions.get('window').height
export type OssStyle = 'avatar'
export const styleMapOssStyle: Record<OssStyle, string> = {
  avatar: 'avatar',
}
/**
 * 获取图片的完整url
 */
export function getPicFullUrl(url: string): string {
  return url.indexOf('http') === zeroPos ? url : BASE_URL + url
}
/**
 * 获取图片的cdn url
 */
export function getPicCdnUrl(url: string, style: OssStyle | null = null): string {
  let styleQuery = ''
  if (style) {
    styleQuery = '?x-oss-process=style/' + styleMapOssStyle[style]
  }
  // avatar
  return url.indexOf('http') === zeroPos || url.indexOf('blob:http') === zeroPos
    ? url + styleQuery
    : CDN_BASE_URL + url + styleQuery
}
/**
 * 获取文件的cdn url
 */
export function getFileCdnUrl(url: string): string {
  return getPicCdnUrl(url)
}
// declare module NativeModules {
//   export const SourceCode: {
//     scriptURL: string
//   }
// }
/**
 * 识别开发环境是否是debug开发环境
 */
export function isDebugMode() {
  try {
    const { scriptURL } = NativeModules.SourceCode
    return (
      (scriptURL as string).indexOf('dev=true') !== notFound ||
      (scriptURL as string).indexOf('http://localhost') === zeroPos
    )
  } catch (e) {
    console.log('buffge: ', e)
    return false
  }
}
export function disableFontScale() {
  // @ts-ignore
  Text.defaultProps = { ...(Text.defaultProps || {}), allowFontScaling: false }
  // @ts-ignore
  TextInput.defaultProps = { ...(Text.defaultProps || {}), allowFontScaling: false }
}
