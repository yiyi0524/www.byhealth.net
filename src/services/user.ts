import { bget, bpost, GetListParam } from "./api"
import { Picture } from "@/pages/advisory/Chat"
import { prescriptionItem } from "@/pages/index/Prescription"
//todo 获取个人信息
export interface PersonalInfo {
  info: {
    id: number
    account: string
    name: string
    gender: number
    phone: string
    email: string
    avatar: Picture
    profile: string
  }
  doctorInfo: DoctorInfo
}
export interface DoctorInfo {
  id: number
  uid?: number
  hasRealNameAuth: boolean
  prescriptionCount: number
  patientCount: number
  technicalTitle?: number
  profile: string
  departmentId?: number
  adeptSymptomIdList?: number[]
  countyCid?: string
  provinceCid?: string
  hospitalId?: number
}

export async function getPersonalInfo() {
  return bget<PersonalInfo>({
    url: "/api/getDoctorPersonalInfo",
  })
}

/**
 * 获取医生已开处方列表
 */
export async function getPrescriptionList({ page = -1, limit = -1, filter = {} }: GetListParam) {
  return bget<{ list: prescriptionItem[] }>({
    url: "api/getDoctorPrescriptionList",
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
  deletePatientGroup,
  addPatientGroup,
  getHospitalList,
  getPrescriptionList,
  setOnlineReferral,
  setDisturbanceFreePeriod,
  setReviewPrice,
  setFollowUpReviewPrice,
}
