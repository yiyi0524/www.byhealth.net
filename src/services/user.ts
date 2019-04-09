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
  doctorInfo?: DoctorInfo
}
export interface DoctorInfo {
  id: number
  uid?: number
  technicalTitle?: number
  departmentIdr?: number
  adeptSymptomIdList?: number[]
  countyCid?: string
  hospitalId?: number
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
      doctorInfo: {
        id: 1,
        technicalTitle: 2,
        departmentIdr: 3,
        countyCid: "110100000000",
        hospitalId: 1,
        adeptSymptomIdList: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
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
export async function getPatientGroupList({ page = -1, limit = -1, filter = {} }: GetListParam) {
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
 * todo 获取已开处方列表
 */
export async function getPrescriptionList({ page = -1, limit = -1, filter = {} }: GetListParam) {
  return bget({
    url: "/getPrescriptionList",
    query: {
      page,
      limit,
      filter,
    },
  })
}
/**
 * 获取医院列表
 */
export async function getHospitalList({ page = -1, limit = -1, filter = {} }: GetListParam) {
  return bget({
    url: "/hospital/getList",
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
/**
 * todo 编辑资料 修改擅长治疗的疾病
 */
export async function setAdeptSymptomIdList({
  adeptSymptomIdList,
}: {
  adeptSymptomIdList: number[]
}) {
  return bpost({
    url: "/setAdeptSymptomIdList",
    data: {
      adeptSymptomIdList,
    },
  })
}
/**
 * todo 编辑资料 修改我的简介
 */
export async function setProfile({ profile }: { profile: string }) {
  return bpost({
    url: "/setProfile",
    data: {
      profile,
    },
  })
}
/**
 * todo 设置在线复诊说明
 */
export async function setOnlineReferral({
  onlineReferralChecked,
}: {
  onlineReferralChecked: boolean
}) {
  return bpost({
    url: "/setOnlineReferral",
    data: {
      onlineReferralChecked,
    },
  })
}
/**
 * todo 这只免打扰时段  当start为00:00 end:00:00,为随时可打扰我
 */
export async function setDisturbanceFreePeriod({
  disturbanceFreePeriod,
}: {
  disturbanceFreePeriod: {
    start: string
    end: string
  }
}) {
  return bpost({
    url: "/setDisturbanceFreePeriod",
    data: {
      disturbanceFreePeriod,
    },
  })
}
/**
 * todo 设置复诊价格 单位为分
 */
export async function setReviewPrice({ reviewPrice }: { reviewPrice: number }) {
  return bpost({
    url: "/setReviewPrice",
    data: {
      reviewPrice,
    },
  })
}
/**
 * todo 设置复诊价格 单位为分
 */
export async function setFollowUpReviewPrice({
  followUpReviewPrice,
}: {
  followUpReviewPrice: number
}) {
  return bpost({
    url: "/setFollowUpReviewPrice",
    data: {
      followUpReviewPrice,
    },
  })
}

export default {
  getPersonalInfo,
  getPatientGroupList,
  deletePatientGroup,
  addPatientGroup,
  getHospitalList,
  setAdeptSymptomIdList,
  setProfile,
  getPrescriptionList,
  setOnlineReferral,
  setDisturbanceFreePeriod,
  setReviewPrice,
  setFollowUpReviewPrice,
}
