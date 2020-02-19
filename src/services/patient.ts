import { communicationItem } from '@/pages/address_book/Index'
import { MedicalRecord } from '@/pages/address_book/PatientDetail'
import { Picture } from '@/pages/advisory/Chat'
import { bget, GetListParam } from './api'
import { PrescriptionDrugCategory } from '@/pages/advisory/SquareRoot'
export async function getAddressBoolPatientList({ page = -1, limit = -1, filter }: GetListParam) {
  return bget<{ list: communicationItem[] }>({
    url: 'api/getAddressBoolPatientList',
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
    url: 'api/getPatientInfo',
    query: {
      uid,
    },
  })
}
//药品列表如下结构
export interface Drug {
  categoryId: number
  list: DrugItem[]
  doseCount?: number
  dailyDose?: number
  everyDoseUseCount?: number
}
export interface DrugItem {
  id?: number
  detail?: DrugInfo
  count: number
  usage: string
}
export interface DrugInfo {
  isChinesePatentDrug?: boolean
  picture?: Picture | null
  categoryId?: number
  ctime?: string
  description?: string
  drug_interaction?: string
  dtime?: string
  id: number
  manufacturer?: string
  name?: string
  notes?: string
  pic_id?: number
  price?: number
  signature?: string
  standard?: string
  taboo?: string
  type?: number
  unit?: string
  untoward_effect?: string
  utime?: string
}
//问诊单详情
export interface inquirySheet {
  name: string
  height: number
  weight: number
  allergyHistory: string //过敏史
  medicalHistory: string //病史
  state: string //用户情况,症状与病情
  hospitalMedicalRecordPicList: Picture[] //实体医疗机构病历列表
  tonguePicList: Picture[] //舌照面
  infectedPartPicList: Picture[] //患部
  facePicList: Picture[] //面部
  dialoguePicList: Picture[] //对话照片
  problems: InquirySheet //问题列表
}
export interface InquirySheet {
  type: number
  subjectList: subject[]
}
export interface subject {
  title: string
  type: number
  options: option[]
  answer: number[]
}
export interface option {
  title: string
  isNormal: boolean
}
/**
 *  获取问诊单详情
 */
export async function getInquirySheet({ patientUid, consultationId }: { patientUid: number; consultationId: number }) {
  return bget<{ detail: inquirySheet }>({
    url: 'patientApi/getAppInquirySheet',
    query: {
      patientUid,
      consultationId,
    },
  })
}
export interface medicalRecord {
  doctor: {
    name: string
  }
  patient: {
    name: string
    avatar: Picture
    gender: number
    yearAge: number
    monthAge: number
  }
  discrimination: string //辨病
  syndromeDifferentiation: string //辨证
  drugList: Drug[]
  cost: {
    drugCost: number
    doctorServiceCost: number
    expressCost: number
  }
  time: string
}
/**
 *  获取病历详情
 */
export async function getMedicalRecord({ prescriptionId, patientUid }: { prescriptionId: number; patientUid: number }) {
  return bget<{ detail: medicalRecord }>({
    url: 'patientApi/getMedicalRecord',
    query: {
      prescriptionId,
      patientUid,
    },
  })
}
/**
 *   获取患者个人病史列表 filter 中有 patientId
 */
export async function listMedicalRecord({ page = -1, limit = -1, filter }: GetListParam) {
  return bget<{ list: MedicalRecord[] }>({
    url: 'patient/listMedicalRecord',
    query: {
      page,
      limit,
      filter,
    },
  })
}
/**
 *   获取患者问诊单问题
 */
export async function inquirySheet({ consultationId }: { consultationId: number }) {
  return bget<{ detail: InquirySheet }>({
    url: 'patient/inquirySheet',
    query: {
      consultationId,
    },
  })
}
/**
 *   获取患者上次开方信息
 */
export async function getLastPrescriptionInfo({ patientUid }: { patientUid: number }) {
  return bget<{ detail: PrescriptionDrugCategory[] | null }>({
    url: 'api/getLastPrescriptionInfo',
    query: {
      patientUid,
    },
  })
}
export default {
  getLastPrescriptionInfo,
  getAddressBoolPatientList,
  getPatientInfo,
  getInquirySheet,
  getMedicalRecord,
  listMedicalRecord,
  inquirySheet,
}
