import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";
const ALL_TIME = -1;
const setSingle = Symbol();
const getSingle = Symbol();
const setMulti = Symbol();
const getMulti = Symbol();
export default {
  set: async function(k: string, v: any, expire = ALL_TIME) {
    return typeof arguments[0] === "string"
      ? await this[setSingle](k, v, expire)
      : await this[setMulti](k);
  },
  get: async function(k: string) {
    return typeof k === "string" ? await this[getSingle](k) : await this[getMulti](k);
  },
  [setSingle]: async function(k: string, v: any, expire = ALL_TIME) {
    const data = {
      val: v,
      expire,
    };
    if (data.expire !== ALL_TIME) {
      // @ts-ignore
      data.expire = moment()
        .add(data.expire, "s")
        .format("YYYY-MM-DD HH-mm-ss");
    }
    return await AsyncStorage.setItem(k, JSON.stringify(data));
  },
  [getSingle]: async function(k: string) {
    let data, realData, now;
    try {
      let json = await AsyncStorage.getItem(k);
      if (!json) {
        return null;
      }
      data = JSON.parse(json);
    } catch (e) {
      return null;
    }
    if (data === null) {
      return null;
    }
    realData = data.val;
    now = new Date();
    if (data.expire !== ALL_TIME && now > new Date(data.expire)) {
      this.remove(k);
      return null;
    }
    return realData;
  },
  [setMulti]: async function(arr: any) {
    let keys = Object.keys(arr);
    let dataArr = [];
    for (let key of keys) {
      const [k, v, expire = ALL_TIME] = arr[key];
      const data = {
        val: v,
        expire,
      };
      if (data.expire !== ALL_TIME) {
        data.expire = moment()
          .add(data.expire, "s")
          .format("YYYY-MM-DD HH-mm-ss");
      }
      dataArr.push([k, JSON.stringify(data)]);
    }
    return await AsyncStorage.multiSet(dataArr);
  },
  [getMulti]: async function(arr: any) {
    let dataArr = [];
    let res = await AsyncStorage.multiGet(arr);
    for (let v of res) {
      if (v[1] !== null) {
        let now = new Date();
        let data = JSON.parse(v[1]).val;
        if (data.expire !== ALL_TIME && now > new Date(data.expire)) {
          this.remove(v[0]);
          dataArr.push([v[0], null]);
        } else {
          dataArr.push([v[0], data]);
        }
      } else {
        dataArr.push([v[0], null]);
      }
    }
    return dataArr;
  },
  has: async function(k: string) {
    return (await this.get(k)) !== null;
  },
  remove: async function(k: string) {
    return await AsyncStorage.removeItem(k);
  },
  clear: async function() {
    return await AsyncStorage.clear();
  },
  getAllKeys: async function() {
    return await AsyncStorage.getAllKeys();
  },
};
