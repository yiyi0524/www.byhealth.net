import { bget, bpost, GetListParam } from "./api"
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
export default {
  doctorAuth,
  getMsgList,
}
