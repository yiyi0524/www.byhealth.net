import { bget, GetListParam } from "./api"
import { communicationItem } from "@/pages/address_book/Index"
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

export default {
  getAddressBoolPatientList,
  getPatientInfo,
}
