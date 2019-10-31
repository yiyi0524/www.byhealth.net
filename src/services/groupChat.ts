import { bget, GetListParam, bpost } from "./api"
import { Picture } from "@/pages/advisory/Chat"
import gImg from "@utils/img"

export const TAB = {
  GROUP_CHAT: 0x0,
  MY_GROUP_CHAT: 0x1,
}
export const TAB_ZH = {
  [TAB.GROUP_CHAT]: "精选群聊",
  [TAB.MY_GROUP_CHAT]: "我加入的",
}
export const STATUS = {
  //是否加入 0 :未加入 1:加入
  NOT_JOINED: 0x0,
  JOINED: 0x1,
}

//群聊
export interface GroupChat {
  id: number
  pic: Picture
  title: string
  desc: string
  status: number
  joinedTime?: string
  msgCount?: number
}
/**
 * 获取群聊列表
 */
export function listGroupChat(data: GetListParam) {
  console.log(data)
  return {
    data: {
      list: [
        {
          id: 1,
          pic: {
            id: 1,
            title: "",
            url: gImg.common.defaultAvatar,
          },
          title: "广东省中西医结合学会感染病",
          desc: "本聊天室用于中医学术交流，学术论文查看",
          status: 0,
          msgCount: 3,
          joinedTime: "2019-10-31 17:23:00",
        },
        {
          id: 2,
          pic: {
            id: 1,
            title: "",
            url: gImg.common.defaultAvatar,
          },
          title: "广东省中西医结合学会感染病",
          desc: "本聊天室用于中医学术交流，学术论文查看",
          status: 0,
          msgCount: 6,
          joinedTime: "2019-10-31 17:15:00",
        },
        {
          id: 3,
          pic: {
            id: 1,
            title: "",
            url: gImg.common.defaultAvatar,
          },
          title: "广东省中西医结合学会感染病",
          desc: "本聊天室用于中医学术交流，学术论文查看",
          status: 0,
          msgCount: 9,
          joinedTime: "2019-10-31 14:00:00",
        },
        {
          id: 4,
          pic: {
            id: 1,
            title: "",
            url: gImg.common.defaultAvatar,
          },
          title: "广东省中西医结合学会感染病",
          desc: "本聊天室用于中医学术交流，学术论文查看",
          status: 0,
          msgCount: 11,
          joinedTime: "2019-10-30 10:00:00",
        },
        {
          id: 5,
          pic: {
            id: 1,
            title: "",
            url: gImg.common.defaultAvatar,
          },
          title: "广东省中西医结合学会感染病",
          desc: "本聊天室用于中医学术交流，学术论文查看",
          status: 0,
          msgCount: 0,
          joinedTime: "2019-10-29 10:00:00",
        },
        {
          id: 6,
          pic: {
            id: 1,
            title: "",
            url: gImg.common.defaultAvatar,
          },
          title: "广东省中西医结合学会感染病",
          desc: "本聊天室用于中医学术交流，学术论文查看",
          status: 0,
          msgCount: 99,
          joinedTime: "2019-10-28 10:00:00",
        },
        {
          id: 7,
          pic: {
            id: 1,
            title: "",
            url: gImg.common.defaultAvatar,
          },
          title: "广东省中西医结合学会感染病",
          desc: "本聊天室用于中医学术交流，学术论文查看",
          status: 0,
          msgCount: 0,
          joinedTime: "2019-10-10 10:00:00",
        },
      ] as GroupChat[],
    },
  }
  // return bpost<{ list: GroupChat[] }>({
  //   url: "api/listGroupChat",
  //   data,
  // })
}
export default {
  listGroupChat,
}
