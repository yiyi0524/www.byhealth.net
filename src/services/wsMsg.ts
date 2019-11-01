import { bget, GetListParam } from "./api"
// import { Msg } from "@/pages/advisory/Chat"
import { Msg } from "@/pages/Ws"

/**
 * 获取消息列表
 */
async function getMsgList({ page, limit, filter = {} }: GetListParam) {
  return bget<{ list: Msg[] }>({
    url: "/ws/getMsgList",
    query: {
      page,
      limit,
      filter,
    },
  })
}

export default {
  getMsgList,
}
