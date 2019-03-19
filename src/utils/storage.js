import { Platform, AsyncStorage } from 'react-native';
import { jsDate2DateTime } from './utils';

const ALL_TIME = -1;
const setSingle = Symbol();
const getSingle = Symbol();
const setMulti = Symbol();
const getMulti = Symbol();
export default {
    set: async function (k, v, expire = ALL_TIME) {
        return typeof arguments[0] === 'string' ?
            await this[setSingle](k, v, expire) :
            await this[setMulti](k);
    },
    get: async function (k) {
        return typeof k === 'string' ? await this[getSingle](k) : await this[getMulti](k);
    },
    [setSingle]: async function (k, v, expire = ALL_TIME) {
        const data = {
            val: v,
            expire,
        }
        if (data.expire !== ALL_TIME) {
            data.expire = jsDate2DateTime(data.expire)
        }
        return await AsyncStorage.setItem(k, JSON.stringify(data));
    },
    [getSingle]: async function (k) {
        let data, realData, now;
        try {
            data = JSON.parse(await AsyncStorage.getItem(k));
        } catch (e) {
            return null
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
    [setMulti]: async function (arr) {
        let keys = Object.keys(arr);
        let dataArr = [];
        for (let key of keys) {
            const [
                k, v, expire = ALL_TIME
            ] = arr[key];
            const data = {
                val: v,
                expire,
            }
            if (data.expire !== ALL_TIME) {
                data.expire = jsDate2DateTime(data.expire)
            }
            dataArr.push([
                k, JSON.stringify(data),
            ]);
        }
        return await AsyncStorage.multiSet(dataArr)
    },
    [getMulti]: async function (arr) {
        let dataArr = [];
        let res = await AsyncStorage.multiGet(arr);
        for (let v of res) {
            if (v[1] !== null) {
                let now = new Date();
                let data = JSON.parse(v[1]).val
                if (data.expire !== ALL_TIME && now > new Date(data.expire)) {
                    this.remove(v[0]);
                    dataArr.push([
                        v[0], null,
                    ])
                } else {
                    dataArr.push([
                        v[0], data,
                    ])
                }

            } else {
                dataArr.push([v[0], null]);
            }
        }
        return dataArr;
    },
    has: async function (k) {
        return (await this.get(k) !== null);
    },
    remove: async function (k) {
        return await AsyncStorage.removeItem(k);
    },
    clear: async function () {
        return await AsyncStorage.clear();
    },
    getAllKeys: async function () {
        return await AsyncStorage.getAllKeys();
    }
}
