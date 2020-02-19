import { Picture } from '@/pages/advisory/Chat'
import { prescriptionItem } from '@/pages/index/Prescription'
import { bget, GetListParam } from './api'
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
  profile: string
  technicalTitle?: number
  allowInquiry?: number
  departmentId?: number
  adeptSymptomIdList?: number[]
  countyCid?: string
  provinceCid?: string
  hospitalId?: number
  percentageOfCommission?: number
}

export async function getPersonalInfo() {
  return bget<PersonalInfo>({
    url: 'api/getDoctorPersonalInfo',
  })
}

/**
 * 获取医生已开处方列表
 */
export async function getPrescriptionList({ page = -1, limit = -1, filter = {} }: GetListParam) {
  return bget<{ list: prescriptionItem[] }>({
    url: 'api/getDoctorPrescriptionList',
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
    url: '/hospital/getList',
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
export async function getUserWxInfo(query: { openid: string }) {
  return bget<{
    uid: number
    openid: string
    nick: string
    avatar: string // 头像url
  }>({
    url: '/api/getUserWxInfo',
    query,
  })
}
export default {
  getPersonalInfo,
  getHospitalList,
  getPrescriptionList,
}
