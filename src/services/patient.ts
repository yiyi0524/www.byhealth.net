import { bget, bpost, GetListParam } from "./api";
/**
 * 获取某分组的患者信息
 *    filter={
 *        name:"" || "患者名字"
 *     }
 */
export async function getPatientList({
  page = -1,
  limit = -1,
  filter
}: GetListParam) {
  return bget({
    url: "/getPatientList",
    query: {
      page,
      limit,
      filter
    }
  });
}
/**
 * 获取患者个人信息
 */
export function getPatientInfo({ id }: { id: number }) {
  return bpost({
    url: "/api/getPatientInfo",
    data: {
      id
    }
  });
}
export default {
  getPatientInfo,
  getPatientList
};
