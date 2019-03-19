import { Platform, Dimensions, } from 'react-native';
import { Toast } from 'antd-mobile-rn';

const os = Platform.OS;
export const isAndroid = os === 'android';
export const isIos = os === 'ios';
export const windowWidth = Dimensions.get("window").width;
export const windowHeight = Dimensions.get("window").height;
export function jsDate2DateTime(date) {
  let year, month, day, hours, min, sec;
  year = date.getFullYear();
  month = date.getMonth() + 1;
  day = date.getDate();
  hours = date.getHours();
  min = date.getMinutes();
  sec = date.getSeconds();
  return `${year}-${month}-${day} ${hours}:${min}:${sec}`;
}
export function noPage(pageName = '') {
  return Toast.info(`no Page${pageName}`, 1.5);
}
export function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
export function checkUpgrade() {

}

