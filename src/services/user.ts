import { bget, bpost, GetListParam } from "./api";
export async function getPersonalInfo() {
  return bpost({
    url: "/api/getPersonalInfo",
    data: {}
  });
}
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
export default {
  getPersonalInfo,
  getPatientGroupList
};
