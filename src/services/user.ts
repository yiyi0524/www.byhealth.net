import { bget, bpost, GetListParam } from "./api";
export async function getPersonalInfo() {
  return bpost({
    url: "/api/getPersonalInfo",
    data: {}
  });
}
/**
 * 获取患者分组列表
 */
export async function getPatientGroupList({
  page = -1,
  limit = -1,
  filter = {}
}: GetListParam) {
  return bget({
    url: "/getPatientGroupList",
    query: {
      page,
      limit,
      filter
    }
  });
}
/**
 * 删除某患者分组
 */
export async function deletePatientGroup({ id }: { id: number }) {
  return bpost({
    url: "/deletePatientGroup",
    data: {
      id
    }
  });
}
/**
 * 添加分组
 */
export async function addPatientGroup({
  name,
  patientIdList
}: {
  name: string;
  patientIdList: number[];
}) {
  return bpost({
    url: "/addPatientGroup",
    data: {
      name,
      patientIdList
    }
  });
}

export default {
  getPersonalInfo,
  getPatientGroupList,
  deletePatientGroup,
  addPatientGroup
};
