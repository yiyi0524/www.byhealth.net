import { GetListParam, bpost } from "./api"
import { Picture } from "@/pages/advisory/Chat"
import gImg from "@utils/img"
import { Assign } from "utility-types"

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
//文章类型
export const ArticleType = {
  all: 0x0, //所有文章
  personal: 0x1, //我的发布
}

//群聊
export interface GroupChat {
  id: number
  pic: Picture
  title: string
  desc: string
  status: number
  joinedTime?: string //加入群时间
  msgCount?: number //消息条数
}
//群聊成员
export interface GroupChatMember {
  isAdmin: boolean
  id: number
  name: string
  avatar: Picture
}
//文章
export interface Article {
  id: number
  title: string
  content: string
  picList: Picture[]
  viewCount: number
  ctime: string
}
/**
 * 获取群聊列表
 *   filter = {
          status: {
            condition: TYPE.eq,
            val: STATUS.NOT_JOINED, 0 :未加入 1:加入
          },
          search: {
            condition: TYPE.eqString,
            val: search,
          },
        }
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
          title: "广东省中西医结合学会感染病学术交流群",
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
/**
 * 加入群聊
 */
export function addGroupChat(data: { id: number }) {
  return bpost({
    url: "pai/addGroupChat",
    data,
  })
}
/**
 * 获取某群聊列表  排序:管理员在前
 *  filter{
 *  groupChatId:{
 *    condition:eq,
 *    val:id
 *  }
 * }
 */
export function listGroupChatMember(data: GetListParam) {
  console.log(data)
  return {
    data: {
      list: [
        {
          id: 1,
          isAdmin: true,
          name: "阿萨德",
          avatar: {
            id: 1,
            title: "",
            url: "/uploads/20190528/14151cac19744c03114114ed6c9b3cea.jpg",
          },
        },
        {
          id: 2,
          isAdmin: true,
          name: "阿萨德",
          avatar: {
            id: 1,
            title: "",
            url: "/uploads/20190528/14151cac19744c03114114ed6c9b3cea.jpg",
          },
        },
        {
          id: 3,
          isAdmin: false,
          name: "阿萨德",
          avatar: {
            id: 1,
            title: "",
            url: "/uploads/20190528/14151cac19744c03114114ed6c9b3cea.jpg",
          },
        },
        {
          id: 4,
          isAdmin: false,
          name: "阿萨德",
          avatar: {
            id: 1,
            title: "",
            url: "/uploads/20190528/14151cac19744c03114114ed6c9b3cea.jpg",
          },
        },
      ] as Assign<GroupChatMember, { active: boolean }>[],
    },
  }
  // return bpost<{data:{list:Assign<GroupChatMember, { active: boolean }>[]}}>({
  //   url:"api/listGroupChatMember",
  //   data
  // })
}
/**
 * 获取某群聊申请人列表
 *  filter{
 *  groupChatId:{
 *    condition:eq,
 *    val:id
 *  }
 * }
 */
export function listGroupChatApplyMember(data: GetListParam) {
  console.log(data)
  return {
    data: {
      list: [
        {
          id: 1,
          isAdmin: false,
          name: "阿萨德",
          avatar: {
            id: 1,
            title: "",
            url: "/uploads/20190528/14151cac19744c03114114ed6c9b3cea.jpg",
          },
        },
        {
          id: 2,
          isAdmin: false,
          name: "阿萨德",
          avatar: {
            id: 1,
            title: "",
            url: "/uploads/20190528/14151cac19744c03114114ed6c9b3cea.jpg",
          },
        },
        {
          id: 3,
          isAdmin: false,
          name: "阿萨德",
          avatar: {
            id: 1,
            title: "",
            url: "/uploads/20190528/14151cac19744c03114114ed6c9b3cea.jpg",
          },
        },
        {
          id: 4,
          isAdmin: false,
          name: "阿萨德",
          avatar: {
            id: 1,
            title: "",
            url: "/uploads/20190528/14151cac19744c03114114ed6c9b3cea.jpg",
          },
        },
      ] as GroupChatMember[],
    },
  }
  // return bpost<{data:{list:GroupChatMember[]}}>({
  //   url:"api/listGroupChatApplyMember",
  //   data
  // })
}
/**
 * 检查自己是否是某群的管理员
 */
export function checkGroupChatAdministrators(data: { groupChatId: number }) {
  console.log(data)
  return { data: { isAdmin: true } }
  // return bpost<{data:{isAdmin:boolean}}>({
  //   url: "api/checkGroupChatAdministrators",
  //   data,
  // })
}
/**
 * 删除某群的成员
 */
export function delGroupChatmember(data: { groupChatId: number; ids: number[] }) {
  return bpost({
    url: "api/delGroupChatmember",
    data,
  })
}
/**
 * 添加文章
 */
export function addArticle(data: { title: string; content: string; picList: Picture[] }) {
  return bpost({
    url: "api/addArticle",
    data,
  })
}
/**
 * 编辑文章
 */
export function editArticle(data: {
  id: number
  title: string
  content: string
  picList: Picture[]
}) {
  return bpost({
    url: "api/editArticle",
    data,
  })
}
/**
 * 文章列表
 * filter:{
 * type:{
 *   condition:eq,
 *   val:ArticleType
 * },
 *  search:{
 *    condition:eqString,
 *    val:string
 * },
 * }
 */
export function listArticle(data: GetListParam) {
  console.log(data)
  return {
    data: {
      list: [
        {
          id: 1,
          title: "广东省中西医结合学会肾病委...",
          content: "牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题...",
          picList: [
            {
              id: 1,
              title: "",
              url: "/uploads/20190528/14151cac19744c03114114ed6c9b3cea.jpg",
            },
            {
              id: 1,
              title: "",
              url: "/uploads/20190528/14151cac19744c03114114ed6c9b3cea.jpg",
            },
            {
              id: 1,
              title: "",
              url: "/uploads/20190528/14151cac19744c03114114ed6c9b3cea.jpg",
            },
          ],
          viewCount: 103,
          ctime: "2019-10-10 10:00:00",
        },
        {
          id: 2,
          title: "广东省中西医结合学会肾病委...",
          content: "牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题...",
          picList: [],
          viewCount: 103,
          ctime: "2019-10-10 10:00:00",
        },
        {
          id: 3,
          title: "广东省中西医结合学会肾病委...",
          content: "牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题...",
          picList: [],
          viewCount: 103,
          ctime: "2019-10-10 10:00:00",
        },
        {
          id: 4,
          title: "广东省中西医结合学会肾病委...",
          content: "牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题...",
          picList: [],
          viewCount: 103,
          ctime: "2019-10-10 10:00:00",
        },
        {
          id: 5,
          title: "广东省中西医结合学会肾病委...",
          content: "牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题...",
          picList: [],
          viewCount: 103,
          ctime: "2019-10-10 10:00:00",
        },
        {
          id: 6,
          title: "广东省中西医结合学会肾病委...",
          content: "牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题...",
          picList: [],
          viewCount: 103,
          ctime: "2019-10-10 10:00:00",
        },
        {
          id: 7,
          title: "广东省中西医结合学会肾病委7...",
          content: "牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题...",
          picList: [],
          viewCount: 103,
          ctime: "2019-10-10 10:00:00",
        },
        {
          id: 8,
          title: "广东省中西医结合学会肾病委...",
          content: "牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题...",
          picList: [],
          viewCount: 103,
          ctime: "2019-10-10 10:00:00",
        },
        {
          id: 9,
          title: "广东省中西医结合学会肾病委...",
          content: "牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题...",
          picList: [],
          viewCount: 103,
          ctime: "2019-10-10 10:00:00",
        },
        {
          id: 10,
          title: "广东省中西医结合学会肾病委10...",
          content: "牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题...",
          picList: [],
          viewCount: 103,
          ctime: "2019-10-10 10:00:00",
        },
        {
          id: 11,
          title: "广东省中西医结合学会肾病委11...",
          content: "牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题...",
          picList: [],
          viewCount: 103,
          ctime: "2019-10-10 10:00:00",
        },
      ] as Article[],
    },
    count: 15,
  }
  // return bpost<{ data: { list: Article[] },count:number }>({
  //   url: "api/listArticle",
  //   data,
  // })
}
/**
 * 获取文章详情
 */
export function getArticle(data: { id: number }) {
  console.log(data)
  return {
    data: {
      detail: {
        id: 1,
        title: "广东省中西医结合学会肾病委...",
        content:
          "牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题牙齿矫正方案汇总，牙齿矫正一直是医学界的一大难题...",
        picList: [
          {
            id: 1,
            title: "",
            url: "/uploads/20190528/14151cac19744c03114114ed6c9b3cea.jpg",
          },
          {
            id: 1,
            title: "",
            url: "/uploads/20190528/14151cac19744c03114114ed6c9b3cea.jpg",
          },
          {
            id: 1,
            title: "",
            url: "/uploads/20190528/14151cac19744c03114114ed6c9b3cea.jpg",
          },
        ],
        viewCount: 103,
        ctime: "2019-10-10 10:00:00",
      } as Article,
    },
  }
  // return bpost<{ data: { detail: Article } }>({
  //   url: "api/getArticle",
  //   data,
  // })
}
/**
 * 文章阅读量+1
 */
export function articleViewCount(data: { id: number }) {
  return bpost({
    url: "api/articleViewCount",
    data,
  })
}
/**
 * 检查是否为自己的文章
 */
export function checkIsPersonalArticle(data: { id: number }) {
  console.log(data)
  return { data: { isPersonalArticle: true } }
  // return bpost<{ data: { isPersonalArticle:boolean } }>({
  //   url: "api/checkIsPersonalArticle",
  //   data,
  // })
}
export default {
  listGroupChat,
}
