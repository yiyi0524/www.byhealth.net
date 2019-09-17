import { Platform, Dimensions, NativeModules, Text, TextInput } from "react-native"
import { BASE_URL, CDN_BASE_URL } from "@/config/api"

const os = Platform.OS
export const isAndroid = os === "android"
export const isIos = os === "ios"
export const windowWidth = Dimensions.get("window").width
export const windowHeight = Dimensions.get("window").height
/**
 * 获取图片的完整url
 */
export function getPicFullUrl(url: string): string {
  return url.indexOf("http") === 0 ? url : BASE_URL + url
}
/**
 * 获取图片的cdn url
 */
export function getPicCdnUrl(url: string): string {
  return url.indexOf("http") === 0 ? url : CDN_BASE_URL + url
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
      (scriptURL as string).indexOf("dev=true") !== -1 ||
      (scriptURL as string).indexOf("http://localhost") === 0
    )
  } catch (e) {
    console.log("buffge: ", e)
    return false
  }
}
export function disableFontScale() {
  // @ts-ignore
  Text.defaultProps = { ...(Text.defaultProps || {}), allowFontScaling: false }
  // @ts-ignore
  TextInput.defaultProps = { ...(Text.defaultProps || {}), allowFontScaling: false }
}
