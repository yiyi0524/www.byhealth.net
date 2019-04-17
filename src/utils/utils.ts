import { Platform, Dimensions } from "react-native"
import { BASE_URL } from "@/config/api"

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
