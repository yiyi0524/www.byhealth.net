import { Picture } from "@/pages/advisory/Chat"
import { bget, bpost } from "./api"
// import { JsonRes } from "jsbdk"
interface PostInquiry {
  patient: {
    msgList: Msg[]
    avatar: Picture
  }
  doctor: {
    msgList: Msg[]
    avatar: Picture
  }
}
export interface Msg {
  isPatient?: boolean
  avatar?: string
  msg: string
  picIdList?: number[]
}

/**
 * 获取诊后咨询详情
 */
export async function getPostInquiry(query: { doctorPatientId: number }) {
  return bget<PostInquiry>({
    url: "api/getPostInquiry",
    query,
  })
}
export function sendPostInquiryMsg(data: { id: number; msg: string }) {
  return bpost({
    url: "api/sendPostInquiryMsg",
    data,
  })
}
export default {
  getPostInquiry,
  sendPostInquiryMsg,
}
