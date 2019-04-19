import { communicationItem } from "@/pages/address_book/Index"
import { bget, GetListParam } from "./api"
import { GENDER } from "./doctor"
/**
 * todo获取资讯患者信息
 *
 */
export async function getPatientList({ page = -1, limit = -1, filter }: GetListParam) {
  return {
    data: {
      list: [
        {
          id: 4,
          patientId: 1,
          avatar: {
            id: -1,
            url: "",
            title: "",
          },
          age: 30,
          gender: GENDER.WOMAN,
          name: "孟雷",
          phone: "15096483854",
          currMsg: "你好 我是孟雷,我头痛",
          currMsgTime: "2019-03-22 10:10:10",
        },
        {
          id: 1,
          patientId: 2,
          avatar: {
            id: -1,
            url: "",
            title: "",
          },
          age: 24,
          gender: GENDER.MAN, //1:男;2:女'0:未知
          name: "吴亦凡",
          phone: "15096483854",
          currMsg: "医生, 头还有点晕咋整?",
          currMsgTime: "2019-03-22 10:10:10",
        },
      ],
    },
  }
  return bget({
    url: "/getPatientList",
    query: {
      page,
      limit,
      filter,
    },
  })
}
/**
 * todo获取某分组的患者信息
 *    filter={
 *        name:"" || "患者名字"
 *     }
 */
export async function getAddressBoolPatientList({ page = -1, limit = -1, filter }: GetListParam) {
  return bget<{ list: communicationItem[] }>({
    url: "api/getAddressBoolPatientList",
    query: {
      page,
      limit,
      filter,
    },
  })
}
/**
 * 获取患者个人信息
 */
export function getPatientInfo({ uid }: { uid: number }) {
  return bget({
    url: "api/getPatientInfo",
    query: {
      uid,
    },
  })
}

export default {
  getPatientInfo,
  getPatientList,
  getAddressBoolPatientList,
}
