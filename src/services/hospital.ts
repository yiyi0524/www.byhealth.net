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
export default {
  getList,
};
