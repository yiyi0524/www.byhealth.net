import { DayStage } from '@/components/Calendar'
import { patientGroupItem } from '@/pages/address_book/Group'
import { patientItem } from '@/pages/address_book/GroupDetail'
import { Picture } from '@/pages/advisory/Chat'
import { ConsultationItem } from '@/pages/advisory/Index'
import { PrescriptionDrugCategory, PrescriptionDrugInfo } from '@/pages/advisory/SquareRoot'
import { Drug as DrugInfo } from '@api/patient'
import { bget, bpost, GetListParam } from './api'
/**
 * 扫码用户
 */
export interface ScanUser {
  openid: string
  nick: string
  avatar: string
  scanTime: string
  gender: number
}
export const ALLOW_INQUIRY = {
  FALSE: 0x0,
  TRUE: 0x1,
}
export const ALLOW_SEARCH_ME = {
  FALSE: 0x0,
  TRUE: 0x1,
}
export const GENDER = {
  UNDEFINED: 0x0,
  MAN: 0x1,
  WOMAN: 0x2,
}
export const GENDER_ZH = {
  [GENDER.UNDEFINED]: '未知',
  [GENDER.MAN]: '男',
  [GENDER.WOMAN]: '女',
}
export const STATUS = {
  process: 0x0,
  pass: 0x1,
  reject: 0x2,
}
export const STATUS_ZH = {
  [STATUS.process]: '处理中',
  [STATUS.pass]: '已通过',
  [STATUS.reject]: '已拒绝',
}
/**
 * 处方状态
 */
export const PRESCRIPTION_STATUS = {
  waitPay: 0x0,
  completePay: 0x1,
}
export const PRESCRIPTION_STATUS_ZH = {
  [PRESCRIPTION_STATUS.waitPay]: '等待支付',
  [PRESCRIPTION_STATUS.completePay]: '已支付',
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
  [TECHNICAL_TITLE.RESIDENT]: '住院医师',
  [TECHNICAL_TITLE.ATTENDING_DOCTOR]: '主治医师',
  [TECHNICAL_TITLE.DEPUTY_CHIEF_PHYSICIAN]: '副主任医师',
  [TECHNICAL_TITLE.CHIEF_PHYSICIAN]: '主任医师',
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
 * 快捷回复
 */
export const QUICK_REPLY_TYPE = {
  text: 0x0,
  common: 0x1,
  inquiry: 0x2,
  drugAndShipping: 0x3,
  advice: 0x4,
}
export const QUICK_REPLY_TYPE_ZH = {
  [QUICK_REPLY_TYPE.text]: '文字随访',
  [QUICK_REPLY_TYPE.common]: '常用回复',
  [QUICK_REPLY_TYPE.inquiry]: '诊中问题',
  [QUICK_REPLY_TYPE.drugAndShipping]: '药材与快递',
  [QUICK_REPLY_TYPE.advice]: '调理建议',
}
export const STAGE = {
  morning: 0x0,
  afternoon: 0x1,
  night: 0x2,
}
export const STAGE_ZH = {
  [STAGE.morning]: '上午',
  [STAGE.afternoon]: '下午',
  [STAGE.night]: '晚上',
}
export const SITTING = {
  FALSE: 0x0,
  TRUE: 0x1,
}
export const SITTING_ZH = {
  [SITTING.FALSE]: '坐诊',
  [SITTING.TRUE]: '不坐诊',
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
    url: '/api/doctorAuth',
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
    url: '/api/doctorAuth',
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
    url: 'api/getDoctorBalance',
  })
}
/**
 * 编辑资料 修改擅长治疗的疾病
 */
export function setAdeptSymptomIdList({ adeptSymptomIdList }: { adeptSymptomIdList: number[] }) {
  return bpost({
    url: 'api/setAdeptSymptomIdList',
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
    url: 'api/setProfile',
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
    percentageOfCommission: number
  }>({
    url: 'api/getInquirySetup',
  })
}
/**
 * 设置复诊规则
 */
export function setInquirySetup(data: {
  allowInquiry: number
  initialPrice: number
  followUpPrice: number
  percentageOfCommission: number
}) {
  return bpost({
    url: 'api/setInquirySetup',
    data,
  })
}
/**
 *  获取患者分组列表 返回值不正确
 */
export async function getPatientGroupList(param: GetListParam) {
  return bget<{ list: patientGroupItem[] }>({
    url: 'api/getPatientGroupList',
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
    url: 'api/deletePatientGroup',
    data: {
      id,
    },
  })
}
/**
 * 添加分组
 */
export async function addPatientGroup({ name, patientUidList }: { name: string; patientUidList: number[] }) {
  return bpost({
    url: 'api/addPatientGroup',
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
    url: 'api/getPatientGroupDetail',
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
    url: 'api/listConsultation',
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
    url: 'doctor/getWaitAuditDoctorDetail',
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
  syndromeDifferentiation: string //辨证
  advice: string //医嘱
  drugList: DrugInfo[]
  cost: {
    drugCost: number
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
    url: 'patientApi/getPrescriptionDetail',
    query: {
      prescriptionId,
    },
  })
}
export interface prescriptionDetail {
  type: 'common' | 'phone' | 'wx'
  doctor: {
    name: string
  }
  patient: {
    uid?: number
    name: string
    phone: string
    gender: number
    yearAge: number
    monthAge: number
  }
  discrimination: string //辨病
  syndromeDifferentiation: string //辨证
  advice: string //医嘱
  drugList: DrugInfo[]
  cost: {
    drugCost: number
    machiningCost?: number
    doctorServiceCost: number
    expressCost: number
  }
  time: string
  status: number
  shippingNo: string
  storeId?: number
  storeName?:string  
  stateId?: number
  stateName?:string 
}
/**
 *  获取开方详情
 */
export async function getPrescriptionDetail({ prescriptionId = 0,status = true,phone = '' }: { prescriptionId?: number,status?: boolean,phone?: string }) {
  console.log({
    prescriptionId,
    status,
    phone
  })
  return bget<{ detail: prescriptionDetail }>({
    url: 'patientApi/getPrescriptionDetail',
    query: {
      prescriptionId,
      status,
      phone
    },
  })
}
/**
 * 数据库保存的药品信息
 */
// export interface DbSaveDrugInfo {
//   id: number
//   count: number
//   usage: string
// }
// export interface PrescriptionDrugCategory {
//   category_id: number
//   drug_list: DbSaveDrugInfo[]
// }
export interface AddPrescriptionParam {
  mode?: 'common' | 'phone' | 'wx'
  phone?: string
  patientName?: string
  tplName?: string
  patientUid?: number
  discrimination: string
  serviceMoney?: number
  drugServiceMoney?: number
  syndromeDifferentiation: string
  advice: string
  drugCategoryList: PrescriptionDrugCategory[]
  gender?: number
  yearAge?: number
  monthAge?: number
  stateId?: number
  storeId?: number
}
/**
 * 添加处方
 */
export async function addPrescription(data: AddPrescriptionParam) {
  return bpost<{ id: number }>({
    url: 'api/addPrescription',
    data,
  })
}
/**
 * 关闭问诊
 */
export async function closeInquiry(data: { patientUid: number }) {
  return bpost<{ id: number }>({
    url: 'api/closeInquiry',
    data,
  })
}
/**
 * 获取服务设置
 */
export async function getServiceSettings() {
  return bget<{ allowSearch: number }>({
    url: 'api/getServiceSettings',
  })
}
/**
 * 编辑服务设置
 */
export function setServiceSettings(data: { allowSearch: number }) {
  return bpost({
    url: 'api/setServiceSettings',
    data,
  })
}
/**
 * 医生设置患者不可见(患者无法找到医生)
 */
export function setInvisiblePatients(data: { patientUid: number }) {
  return bpost({
    url: 'api/setInvisiblePatient',
    data,
  })
}
/**
 * 获取不可见患者列表
 */
export interface InvisiblePatient {
  uid: number
  name: string
  gender: number
  yearAge: number
  monthAge: number
  avatar: Picture
  time: string
}
export function listInvisiblePatient({ page, limit, filter = {} }: GetListParam) {
  return bget<{ list: InvisiblePatient[] }>({
    url: 'api/listInvisiblePatient',
    query: {
      page,
      limit,
      filter,
    },
  })
}
export interface QuickReply {
  type: number
  name: string
  list: QuickReplyMsg[]
  isChecked: boolean
}
export interface QuickReplyMsg {
  id: number
  type: number
  msg: string
}
/**
 * 获取快捷回复信息列表 isChecked 全为false
 */
export function listQuickReply({ page, limit, filter = {} }: GetListParam) {
  return bget<{ list: QuickReplyMsg[] }>({
    url: 'api/listQuickReply',
    query: {
      page,
      limit,
      filter,
    },
  })
}
/**
 *  删除快捷回复消息
 */
export function deleteQuickReply(data: { id: number }) {
  return bpost({
    url: 'api/deleteQuickReply',
    data,
  })
}
/**
 * 添加快捷回复消息
 */
export function addQuickReply(data: { type: number; msg: string }) {
  return bpost({
    url: 'api/addQuickReply',
    data,
  })
}
/**
 * 编辑快捷回复消息
 */
export function editQuickReply(data: { id: number; msg: string }) {
  return bpost({
    url: 'api/editQuickReply',
    data,
  })
}
export interface SittingHospital {
  id: number
  value?: number
  label?: string
  address: {
    provinceCid: string
    detail: string
  }
  hospitalName: string
  hospitalId: number
}
/**
 *  坐诊医院列表
 */
export function listSittingHospital({ page, limit, filter = {} }: GetListParam) {
  return bget<{ list: SittingHospital[] }>({
    url: 'api/listSittingHospital',
    query: {
      page,
      limit,
      filter,
    },
  })
}
/**
 * 删除医疗机构
 */
export function deleteSittingHospital(data: { id: number }) {
  return bpost({
    url: 'api/deleteSittingHospital',
    data,
  })
}
/**
 *  添加医疗机构
 */
export function addSittingHospital(data: {
  countyCid: number
  hospitalId: number
  hospitalName: string
  detail: string
}) {
  return bpost({
    url: 'api/addSittingHospital',
    data,
  })
}
/**
 *  获取某条医疗机构
 */
export function getSittingHospital({ id }: { id: number }) {
  return bget<{
    detail: {
      id: number
      provinceCid: string
      cityCid: string
      countyCid: string
      hospitalId: number
      hospitalName: string
      detail: string
    }
  }>({
    url: 'api/getSittingHospital',
    query: {
      id,
    },
  })
}
/**
 * 编辑医疗机构
 */
export function editSittingHospital(data: {
  id: number
  countyCid: number
  hospitalId: number
  hospitalName: string
  detail: string
}) {
  return bpost({
    url: 'api/editSittingHospital',
    data,
  })
}
interface SittingInfo {
  time: string //2019-05-05 00:00:00
  stage: DayStage
  sittingHospitalId: number //坐诊医院id
  isSitting: boolean
  isMonthContinuous: boolean
}
/**
 * 编辑坐诊信息
 */
export async function editSittingInfo(data: SittingInfo) {
  return bpost({
    url: 'api/editSittingInfo',
    data,
  })
}
export interface sittingRecord {
  id: number
  time: string
  stage: number
  hospitalId: number
}
/**
 *  坐诊信息列表
 */
export function listSittingRecord({ page, limit, filter = {} }: GetListParam) {
  return bget<{ list: sittingRecord[] }>({
    url: 'api/listSittingRecord',
    query: {
      page,
      limit,
      filter,
    },
  })
}
/**
 *  获取我的邀请患者二维码
 */
export function getMyInvitePatientQrCode() {
  return bget<{ url: string }>({
    url: 'api/getMyInvitePatientQrCode',
  })
}
export interface PrescriptionTpl {
  id: number
  isSystemTpl: boolean
  categoryId: number
  name: string
  ctime: string
  advice: string
  drugList: PrescriptionDrugInfo[]
  dailyDose: number
  doseCount: number
  everyDoseUseCount: number
}
/**
 *  获取处方模板列列表
 *  filter:{
 *    categoryId:{,
 *      condiction:TYPE.eq,
 *      val:categoryId
 *    }
 *  }
 */
export function listPrescriptionTpl({ page, limit, filter }: GetListParam) {
  return bget<{ list: PrescriptionTpl[] }>({
    url: 'api/listPrescriptionTpl',
    query: {
      page,
      limit,
      filter,
    },
  })
}
/**
 * 获取开方模板详情
 */
export function getPrescriptionTpl({ id }: { id: number }) {
  return bget<{ detail: PrescriptionTpl }>({
    url: 'api/getPrescriptionTpl',
    query: {
      id,
    },
  })
}
/**
 * 添加开方模板
 */
export function addPrescriptionTpl(data: {
  categoryId: number
  name: string
  advice: string
  drugList: PrescriptionDrugInfo[]
  doseCount: number
  dailyDose: number
  everyDoseUseCount: number
}) {
  return bpost<{ detail: PrescriptionTpl }>({
    url: 'api/addPrescriptionTpl',
    data,
  })
}
/**
 *  编辑开方模板
 */
export function editPrescriptionTpl(data: {
  id: number
  name: string
  advice: string
  drugList: PrescriptionDrugInfo[]
  doseCount: number
  dailyDose: number
  everyDoseUseCount: number
}) {
  return bpost<{ detail: PrescriptionTpl }>({
    url: 'api/editPrescriptionTpl',
    data,
  })
}
/**
 * 删除开方模板
 */
export function deletePrescriptionTpl(data: { id: number }) {
  return bpost({
    url: 'api/deletePrescriptionTpl',
    data,
  })
}
/**
 * 清除指定患者的未读消息数量
 */
export function clearPatientUnreadMsgCount(data: { patientUid: number }) {
  return bpost({
    url: 'api/clearPatientUnreadMsgCount',
    data,
  })
}
/**
 * 获取未读消息总数
 */
export function getUnreadMsgCount() {
  return bget<{ unreadMsgCount: number }>({
    url: 'api/getUnreadMsgCount',
  })
}
export const UPLOAD_PRESCRIPTION_STATUS = {
  waitSend: '等待发送',
  hasSend: '发送成功',
  cancelOrder: '取消发送',
}
/**
 *  上传处方
 */
export function uploadPrescription(data: {
  name: string
  advice: string
  serviceMoney: number
  prescriptionPicList: any
}) {
  return bpost({
    url: 'api/uploadLocalPrescription',
    data,
  })
}
/**
 * 上传处方列表
 */
export function listUploadPrescription(query: GetListParam) {
  return bget<{ list: Pick<UploadPrescription, 'id' | 'name' | 'status' | 'ctime'>[] }>({
    url: 'api/listUploadPrescription',
    query,
  })
}
/**
 * 上传处方详情
 */
interface UploadPrescription {
  id: number
  name: string
  serviceMoney: number
  ctime: string
  expressName: string
  expressNo: string
  advice: string
  status: 'hasSend' | 'cancelOrder' | 'waitSend'
  prescriptionPicList: Picture[]
}
export function uploadPrescriptionDetail(query: { id: number }) {
  return bget<{ detail: UploadPrescription }>({
    url: 'api/uploadPrescriptionDetail',
    query,
  })
}
/**
 * 获取扫码用户列表
 */
export function listScanUser() {
  return bget<{ list: ScanUser[] }>({
    url: 'api/listScanUser',
  })
}
/**
 * 获取微信转发url
 */
export function getWxPrescriptionGuideUrl(query: { id: number }) {
  return bget<{ url: string }>({
    url: 'getWxPrescriptionGuideUrl',
    query,
  })
}
/**
 * 获取医师头像
 */
export function getDoctorAvatarUrl() {
  return bget<{ url: string }>({
    url: 'getDoctorAvatarUrl',
  })
}
export default {
  listScanUser,
  uploadPrescriptionDetail,
  listUploadPrescription,
  uploadPrescription,
  getUnreadMsgCount,
  clearPatientUnreadMsgCount,
  deletePrescriptionTpl,
  getPrescriptionTpl,
  editPrescriptionTpl,
  addPrescriptionTpl,
  listPrescriptionTpl,
  getMyInvitePatientQrCode,
  listSittingRecord,
  getSittingHospital,
  addSittingHospital,
  editSittingHospital,
  listSittingHospital,
  deleteSittingHospital,
  closeInquiry,
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
  setServiceSettings,
  getServiceSettings,
  setInvisiblePatients,
  listInvisiblePatient,
  listQuickReply,
  deleteQuickReply,
  editQuickReply,
  addQuickReply,
  editSittingInfo,
}
