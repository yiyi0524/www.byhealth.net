import { bget, bpost, GetListParam } from "./api"
import { Picture } from "@/pages/advisory/Chat"
//todo 获取个人信息
export interface personalInfo {
  id: number
  account: string
  nick: string
  gender: number
  phone: string
  email: string
  avatar: Picture
  profile: string
}
export async function getPersonalInfo() {
  return {
    data: {
      info: {
        id: 5,
        account: "juice",
        nick: "吴大伟",
        phone: "15096443927",
        email: "",
        gender: 1,
        profile: "我是描述",
        avatar: {
          id: 1,
          title: "asd",
          url: "/uploads/20190315/1cec476d9eaef31971abef5e16716365.png",
        },
      },
    },
  }
  // return bpost<infoItem>({
  //   url: "/api/getPersonalInfo",
  //   data: {},
  // })
}
/**
 * 获取患者分组列表
 */
export async function getPatientGroupList({
  page = -1,
  limit = -1,
  filter = {},
}: GetListParam) {
  return bget({
    url: "/getPatientGroupList",
    query: {
      page,
      limit,
      filter,
    },
  })
}
/**
 * 删除某患者分组
 */
export async function deletePatientGroup({ id }: { id: number }) {
  return bpost({
    url: "/deletePatientGroup",
    data: {
      id,
    },
  })
}
/**
 * 添加分组
 */
export async function addPatientGroup({
  name,
  patientIdList,
}: {
  name: string
  patientIdList: number[]
}) {
  return bpost({
    url: "/addPatientGroup",
    data: {
      name,
      patientIdList,
    },
  })
}

export default {
  getPersonalInfo,
  getPatientGroupList,
  deletePatientGroup,
  addPatientGroup,
}
