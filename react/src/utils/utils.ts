import api from '../services/api';
import { LocalStorage as storage } from "jsbdk";

export const getRegion = async () => {
  let json = await api.getRegion();
  const region = json.data.region;
  for (let provinceItem of json.data.region) {
    if (provinceItem.children.length > 0) {
      let cityList = provinceItem.children;
      if (provinceItem.value === undefined) {
        provinceItem.value = provinceItem.cid;
        provinceItem.label = provinceItem.areaName;
        delete provinceItem.cid;
        delete provinceItem.areaName;
        if (!(provinceItem.children.length > 0)) {
          delete provinceItem.children;
        }
      }
      for (let cityItem of cityList) {
        if (cityItem.children.length > 0) {
          if (cityItem.value === undefined) {
            cityItem.value = cityItem.cid;
            cityItem.label = cityItem.areaName;
            delete cityItem.cid;
            delete cityItem.areaName;
            if (!(cityItem.children.length > 0)) {
              delete cityItem.children;
            }
          }
          let countyList = cityItem.children;
          for (let countyItem of countyList) {
            if (countyList.length > 0) {
              if (countyItem.value === undefined) {
                countyItem.value = countyItem.cid;
                countyItem.label = countyItem.areaName;
                delete countyItem.cid;
                delete countyItem.areaName;
                if (!(countyItem.children.length > 0)) {
                  delete countyItem.children;
                }
              }
            }
          }
        }
      }
    }
  }
  if (!storage.has('region')) {
    storage.set('region', region, 0)
  }
  return region
}
export const IdentityCodeValid = async (code: string) => {
  let city: { [k: number]: string } = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
  let tip = "";
  let pass = true;
  let provinceCode = code.substr(0, 2)

  if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
    tip = "身份证号格式错误";
    pass = false;
  }
  else if (!provinceCode || !(provinceCode in city)) {
    tip = "地址编码错误";
    pass = false;
  }
  else {
    //18位身份证需要验证最后一位校验位
    if (code.length === 18) {
      let codeArr = code.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      //校验位
      let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      let sum = 0;
      let ai = 0;
      let wi = 0;
      for (let i = 0; i < 17; i++) {
        ai = parseInt(codeArr[i]);
        wi = factor[i];
        sum += ai * wi;
      }
      // let last = parity[sum % 11];
      if (parity[sum % 11] !== parseInt(codeArr[17])) {
        tip = "校验位错误";
        pass = false;
      }
    }
  }
  let result: any = {};
  result.pass = pass;
  result.msg = tip;
  console.log("身份证验证:");
  console.log(result);
  return result;
}
