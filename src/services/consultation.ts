import { bget, GetListParam, bpost } from "./api"
import { Picture } from "@/pages/advisory/Chat"
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
  // console.log(query)
  // let json: JsonRes<PostInquiry> = {
  //   code: 0,
  //   count: 0,
  //   msg: "",
  //   data: {
  //     patient: {
  //       avatar: {
  //         id: 1,
  //         title: "吴大伟",
  //         url: "/uploads/20190315/1cec476d9eaef31971abef5e16716365.png",
  //       },
  //       msgList: [
  //         {
  //           msg: "医生, 吃了你的药,疼痛缓解了不少,但是下雨的时候头还是有点疼",
  //         },
  //         {
  //           msg: "医生, 吃了你的药,疼痛缓解了不少,但是下雨的时候头还是有点疼",
  //         },
  //       ],
  //     },
  //     doctor: {
  //       avatar: {
  //         id: 1,
  //         title: "吴大伟",
  //         url: "/uploads/20190315/1cec476d9eaef31971abef5e16716365.png",
  //       },
  //       msgList: [
  //         {
  //           msg: "你在吃药期间尽量不要碰水",
  //         },
  //         // {
  //         //   msg: "你在吃药期间尽量不要碰水",
  //         // },
  //       ],
  //     },
  //   },
  // }
  // return json
  return bget<PostInquiry>({
    url: "api/getPostConsultation",
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
