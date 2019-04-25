import { bget, GetListParam } from "./api"
import { communicationItem } from "@/pages/address_book/Index"
import { Picture } from "@/pages/advisory/Chat"
export async function getAddressBoolPatientList({ page = -1, limit = -1, filter }: GetListParam) {
  return bget<{ list: communicationItem[] }>({
    url: "api/getAddressBoolPatientList",
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
    url: "api/getPatientInfo",
    query: {
      uid,
    },
  })
}
//药品列表如下结构
export interface Drug {
  categoryId: number
  list: DrugItem[]
}
export interface DrugItem {
  detail: DrugInfo
  count: number
  usage: string
}
export interface DrugInfo {
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
  lingualSurfacePicList: Picture[] //舌面照
  dialoguePicList: Picture[] //对话照片
  problems: Problem //问题列表
}
export interface Problem {
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
 * todo 获取问诊单详情
 */
export async function getInquirySheet({ uid }: { uid: number }) {
  return {
    data: {
      detail: {
        name: "孟磊",
        height: 175,
        weight: 55,
        allergyHistory: "无",
        medicalHistory: "无",
        state: "头疼 浑身无力",
        lingualSurfacePicList: [
          {
            id: 5,
            title: "",
            url: "/uploads/20190322/e9cf09f8b95064754133810e7776ed81.png",
          },
          {
            id: 6,
            title: "",
            url: "/uploads/20190322/e9cf09f8b95064754133810e7776ed81.png",
          },
          {
            id: 7,
            title: "",
            url: "/uploads/20190322/e9cf09f8b95064754133810e7776ed81.png",
          },
          {
            id: 8,
            title: "",
            url: "/uploads/20190322/e9cf09f8b95064754133810e7776ed81.png",
          },
        ],
        dialoguePicList: [
          {
            id: 1,
            title: "",
            url: "/uploads/20190322/e9cf09f8b95064754133810e7776ed81.png",
          },
          {
            id: 2,
            title: "",
            url: "/uploads/20190322/e9cf09f8b95064754133810e7776ed81.png",
          },
          {
            id: 3,
            title: "",
            url: "/uploads/20190322/e9cf09f8b95064754133810e7776ed81.png",
          },
          {
            id: 4,
            title: "",
            url: "/uploads/20190322/e9cf09f8b95064754133810e7776ed81.png",
          },
        ],
        problems: {
          type: 1,
          subjectList: [
            {
              title: "冷吗",
              type: 1,
              options: [
                {
                  title: "冷",
                  isNormal: false,
                },
                {
                  title: "不冷",
                  isNormal: true,
                },
                {
                  title: "还好",
                  isNormal: false,
                },
              ],
              answer: [2],
            },
            {
              title: "孩子的精神状态与同龄孩子相比如何",
              type: 1,
              options: [
                {
                  title: "精神状况良好",
                  isNormal: false,
                },
                {
                  title: "精神一般",
                  isNormal: true,
                },
                {
                  title: "精神萎靡",
                  isNormal: false,
                },
              ],
              answer: [1, 2],
            },
          ],
        },
      },
    },
  }
  // return bget<{list:inquirySheet[]}>({
  //   url: "patient/getInquirySheet",
  //   query: {
  //     uid,
  //   },
  // })
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
  syndromeDifferentiation: string //辩证
  drugList: Drug[]
  cost: {
    drug: number
    management: number
  }
  time: string
}
/**
 * todo 获取病历详情
 */
export async function getMedicalRecord({ prescriptionId }: { prescriptionId: number }) {
  return {
    data: {
      detail: {
        doctor: {
          name: "孟雷",
        },
        patient: {
          name: "吴大伟",
          avatar: {
            id: 1,
            title: "头像",
            url: "/uploads/20190322/e9cf09f8b95064754133810e7776ed81.png",
          },
          gender: 1,
          yearAge: 2,
          monthAge: 6,
        },
        discrimination: "感冒", //辨病
        syndromeDifferentiation: "流鼻涕 发烧", //辩证
        time: "2019-04-12 17:34:00",
        drugList: [
          {
            categoryId: 1,
            list: [
              {
                detail: {
                  id: 1,
                  unit: "盒",
                },
                count: 3,
                usage: "口服",
              },
              {
                detail: {
                  id: 2,
                  unit: "瓶",
                },
                count: 4,
                usage: "口服",
              },
            ],
          },
          {
            categoryId: 2,
            list: [
              {
                detail: {
                  id: 3,
                  unit: "盒",
                },
                count: 1,
                usage: "口服",
              },
            ],
          },
        ],
        cost: {
          drug: 5600,
          management: 1500,
        },
      },
    },
  }
  // return bget<{ detail: medicalRecord }>({
  //   url: "patient/getInquirySheet",
  //   query: {
  //     prescriptionId,
  //   },
  // })
}
export default {
  getAddressBoolPatientList,
  getPatientInfo,
  getInquirySheet,
  getMedicalRecord,
}
