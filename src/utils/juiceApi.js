import storage from './storage';
import buffFetch from './fetch';
import { BASE_URL } from './config';
import { Platform, Alert, CameraRoll, } from "react-native";
import { Toast } from "antd-mobile-rn";
import RNFS from "react-native-fs";


async function request(url, body) {
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

export function moneyRecord() {
  return request('/juice/moneyRecord');
}
export function scoreRecord() {
  return request('/juice/scoreRecord');
}
export function getPosterList(condtion) {
  let param = typeof condtion === 'number' ? { id: condtion } : { [condtion]: condtion, };
  return request('/juice/getPosterList', param);
}
export function getMyCustomerList(search) {
  return request('/juice/getMyCustomerList', { search });
}
export function getMyCustomerDetail(goodsId) {
  return request('/juice/getMyCustomerDetail', { goodsId });
}
export function getPreviewDetail() {
  return request('/juice/getPreviewDetail');
}
export function getMyShopDetail() {
  return request('/juice/getMyShopDetail');
}
export function addDownloadPosterCount(id) {
  return request('/juice/addDownloadPosterCount', { id });
}

export function downLoadPicture(url) {
  if (!url) return null;
  let isSuccess = false;
  return new Promise((resolve, reject) => {
    let dirs = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath; //外部文件，共享目录的绝对路径（仅限android）
    const downloadDest = `${dirs}/${((Math.random() * 10000000) | 0)}.jpg`;
    const formUrl = url;
    const options = {
      fromUrl: formUrl,
      toFile: downloadDest,
      background: true,
      begin: (res) => {
        // console.log('begin', res);
        // console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
      },
    };
    try {
      const ret = RNFS.downloadFile(options);
      ret.promise.then(res => {
        // console.log('success', res);
        // console.log('file://' + downloadDest)
        var promise = CameraRoll.saveToCameraRoll(downloadDest);
        promise.then(function (result) {
          Toast.success("保存成功, 您可以在相册查看海报", 2);
          isSuccess = true;
        }).catch(function (error) {
          // console.log('error', error);
          Toast.fail('保存失败！请稍后重试', 1);
        });
        resolve(res);
      }).catch(err => {
        reject(new Error(err))
      });
    } catch (e) {
      reject(new Error(e))
    }
    return isSuccess;
  })
}

export function personalProductList() {
  return request('/Yuan/personalProductList');
}
export function successCaseList() {
  return request('/Yuan/successCaseList');
}
export function personalProductAdd(data) {
  return request('/Yuan/personalProductAdd', data);
}
export function personalProductDelete(uid) {
  return request("/Yuan/personalProductDelete", { uid })
}
export function personalProductDetail(productId) {
  return request("/Yuan/personalProductDetail", { productId })
}
export function personalProductEdit(data) {
  return request("/Yuan/personalProductEdit", data)
}

export function successCaseDelete(uid) {
  return request("/Yuan/successCaseDelete", { uid })
}
export function successCaseDetail(successCaseId) {
  return request("/Yuan/successCaseDetail", { successCaseId })
}
export function successCaseEdit(data) {
  return request("/Yuan/successCaseEdit", data)
}
export function successCaseAdd(data) {
  return request("/Yuan/successCaseAdd", data)
}

export function getAutomaticGrab() {
  return request("/juice/getAutomaticGrab")
}
export function setAutomaticGrab(data) {
  return request("/juice/setAutomaticGrab", data)
}
