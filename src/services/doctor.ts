import { bget, bpost, GetListParam } from "./api"
import { patientGroupItem } from "@/pages/address_book/Group"
import { patientItem } from "@/pages/address_book/GroupDetail"
import { ConsultationItem } from "@/pages/advisory/Index"
import { Drug } from "./patient"
import { drugItem } from "@/pages/advisory/SquareRoot"
export const ALLOW_INQUIRY = {
  FALSE: 0x0,
  TRUE: 0x1,
}
export const GENDER = {
  UNDEFINED: 0x0,
  MAN: 0x1,
  WOMAN: 0x2,
}
export const GENDER_ZH = {
  [GENDER.UNDEFINED]: "未知",
  [GENDER.MAN]: "男",
  [GENDER.WOMAN]: "女",
}
export const STATUS = {
  process: 0x0,
  pass: 0x1,
  reject: 0x2,
}
export const STATUS_ZH = {
  [STATUS.process]: "处理中",
  [STATUS.pass]: "已通过",
  [STATUS.reject]: "已拒绝",
}
/**
 * 处方状态
 */
export const PRESCRIPTION_STATUS = {
  waitPay: 0x0,
  completePay: 0x1,
}
export const PRESCRIPTION_STATUS_ZH = {
  [PRESCRIPTION_STATUS.waitPay]: "等待支付",
  [PRESCRIPTION_STATUS.completePay]: "已支付",
}
/**
 * 职称
 */
export const TECHNICAL_TITLE = {
  RESIDENT: 0x0,
  ATTENDING_DOCTOR: 0x1,
  DEPUTY_CHIEF_PHYSICIAN: 0x2,
  CHIEF_PHYSICIAN: 0x3,
}
export const TECHNICAL_TITLE_ZH = {
  [TECHNICAL_TITLE.RESIDENT]: "住院医师",
  [TECHNICAL_TITLE.ATTENDING_DOCTOR]: "主治医师",
  [TECHNICAL_TITLE.DEPUTY_CHIEF_PHYSICIAN]: "副主任医师",
  [TECHNICAL_TITLE.CHIEF_PHYSICIAN]: "主任医师",
}
export interface authParam {
  avatar: { picId: number }
  name: string
  countyCid: string
  idNo: string
  gender: number
  technicalTitle: number
  departmentId: number
  adeptSymptomIdList: [number]
  profile: string
  practisingCertificatePicIdList: [number]
  qualificationCertificatePicIdList: [number]
  technicalQualificationCertificatePicIdList: [number]
  hospitalId?: number
  hospitalName?: string
}
/**
 * 注册
 */
export function doctorAuth({
  avatar,
  name,
  countyCid,
  idNo,
  gender,
  technicalTitle,
  departmentId,
  adeptSymptomIdList,
  profile,
  practisingCertificatePicIdList,
  qualificationCertificatePicIdList,
  technicalQualificationCertificatePicIdList,
  hospitalId,
  hospitalName,
}: authParam) {
  return bpost({
    url: "/api/doctorAuth",
    data: {
      avatar,
      name,
      countyCid,
      idNo,
      gender,
      technicalTitle,
      departmentId,
      adeptSymptomIdList,
      profile,
      practisingCertificatePicIdList,
      qualificationCertificatePicIdList,
      technicalQualificationCertificatePicIdList,
      hospitalId,
      hospitalName,
    },
  })
}
export function getMsgList({ page, limit, filter }: GetListParam) {
  return bget({
    url: "/api/doctorAuth",
    data: {
      page,
      limit,
      filter,
    },
  })
}
/**
 * 获取医生的余额
 */
export function getBalance() {
  return bget({
    url: "api/getDoctorBalance",
  })
}
/**
 * 编辑资料 修改擅长治疗的疾病
 */
export function setAdeptSymptomIdList({ adeptSymptomIdList }: { adeptSymptomIdList: number[] }) {
  return bpost({
    url: "api/setAdeptSymptomIdList",
    data: {
      adeptSymptomIdList,
    },
  })
}
/**
 * 编辑资料 修改我的简介
 */
export function setProfile({ profile }: { profile: string }) {
  return bpost({
    url: "api/setProfile",
    data: {
      profile,
    },
  })
}
/**
 * 获取复诊设置
 */
export function getInquirySetup() {
  return bget<{
    allowInquiry: number
    initialPrice: number
    followUpPrice: number
  }>({
    url: "api/getInquirySetup",
  })
}
/**
 * 设置复诊规则
 */
export function setInquirySetup({
  allowInquiry,
  initialPrice,
  followUpPrice,
}: {
  allowInquiry: number
  initialPrice: number
  followUpPrice: number
}) {
  return bpost({
    url: "api/setInquirySetup",
    data: { allowInquiry, initialPrice, followUpPrice },
  })
}
/**
 * 获取患者分组列表
 */
export async function getPatientGroupList(param: GetListParam) {
  return bget<{ list: patientGroupItem[] }>({
    url: "api/getPatientGroupList",
    query: {
      ...param,
    },
  })
}
/**
 * 删除某患者分组
 */
export async function deletePatientGroup({ id }: { id: number }) {
  return bpost({
    url: "api/deletePatientGroup",
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
  patientUidList,
}: {
  name: string
  patientUidList: number[]
}) {
  return bpost({
    url: "api/addPatientGroup",
    data: {
      name,
      patientUidList,
    },
  })
}

/**
 * 获取患者组详情
 */
export async function getPatientGroupDetail({ id }: { id: number }) {
  return bget<{ detail: { patientList: patientItem[] } }>({
    url: "api/getPatientGroupDetail",
    query: {
      id,
    },
  })
}
/**
 * 获取咨询列表
 */
export async function listConsultation(param: GetListParam) {
  return bget<{ list: ConsultationItem[] }>({
    url: "api/listConsultation",
    query: {
      ...param,
    },
  })
}
/**
 * 获取认证详情
 */
export async function getWaitAuditDoctorDetail() {
  return bget({
    url: "doctor/getWaitAuditDoctorDetail",
    query: {},
  })
}
export interface squareRoot {
  doctor: {
    name: string
  }
  patient: {
    name: string
    gender: number
    yearAge: number
    monthAge: number
  }
  discrimination: string //辨病
  syndromeDifferentiation: string //辩证
  advice: string //医嘱
  drugList: Drug[]
  cost: {
    totalFee: number
    doctorServiceCost: number
    expressCost: number
  }
  time: string
}
/**
 *  获取整体开方详情
 */
export async function getSquareRoot({ prescriptionId }: { prescriptionId: number }) {
  return bget<{ detail: squareRoot }>({
    url: "patientApi/getPrescriptionDetail",
    query: {
      prescriptionId,
    },
  })
}
export interface prescriptionDetail {
  doctor: {
    name: string
  }
  patient: {
    name: string
    gender: number
    yearAge: number
    monthAge: number
  }
  discrimination: string //辨病
  syndromeDifferentiation: string //辩证
  advice: string //医嘱
  drugList: Drug[]
  cost: {
    totalFee: number
    doctorServiceCost: number
    expressCost: number
  }
  time: string
  status: number
}
/**
 *  获取开方详情
 */
export async function getPrescriptionDetail({ prescriptionId }: { prescriptionId: number }) {
  return bget<{ detail: prescriptionDetail }>({
    url: "patientApi/getPrescriptionDetail",
    query: {
      prescriptionId,
    },
  })
}
/**
 * 数据库保存的药品信息
 */
export interface DbSaveDrugInfo {
  id: number
  count: number
  usage: string
}
export interface PrescriptionDrugCategory {
  category_id: number
  drug_list: DbSaveDrugInfo[]
}
export interface AddPrescriptionParam {
  patientUid: number
  discrimination: string
  syndromeDifferentiation: string
  advice: string
  drugList: Record<number, { count: number; info: drugItem }>
}
/**
 * 添加处方
 */
export async function addPrescription(data: AddPrescriptionParam) {
  return bpost<{ id: number }>({
    url: "api/addPrescription",
    data,
  })
}
export default {
  doctorAuth,
  getMsgList,
  getBalance,
  setAdeptSymptomIdList,
  setProfile,
  getInquirySetup,
  setInquirySetup,
  getPatientGroupList,
  deletePatientGroup,
  addPatientGroup,
  getPatientGroupDetail,
  listConsultation,
  getWaitAuditDoctorDetail,
  getSquareRoot,
  getPrescriptionDetail,
  addPrescription,
}
