import { bget, GetListParam } from "./api";

export async function getList({ page = -1, limit = -1, filter = {} }: GetListParam) {
  return bget({
    url: "/hospital/getList",
    query: {
      page,
      limit,
      filter,
    },
  });
}
export async function getDepartmentList({ page = -1, limit = -1, filter = {} }: GetListParam) {
  return bget({
    url: "/hospital/getDepartmentList",
    query: {
      page,
      limit,
      filter,
    },
  });
}
export async function getAllSymptomList({ page = -1, limit = -1, filter = {} }: GetListParam) {
  return bget({
    url: "/hospital/getAllSymptomList",
    query: {
      page,
      limit,
      filter,
    },
  });
}
export default {
  getList,
  getDepartmentList,
  getAllSymptomList,
};