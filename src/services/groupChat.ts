import { Picture } from "@/pages/advisory/Chat"
import { Assign } from "utility-types"
import { bget, bpost, GetListParam } from "./api"

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
  notJoined: "notJoined",
  joined: "joined",
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
  name: string
  userList: { id: number; uid: number; nick: string; phone: string; isAdmin: boolean }[]
  applyList: { id: number; uid: number; nick: string; phone: string }[]
  description: string //群简介
  ctime: string
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
  author: {
    uid: number
    name: string
    phone: string
  }
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
            val: STATUS.notJoined, 0 :未加入 1:加入
          },
          search: {
            condition: TYPE.eqString,
            val: search,
          },
        }
 */
export function listGroupChat(query: GetListParam) {
  return bget<{ list: GroupChat[] }>({
    url: "chatGroup/list",
    query,
  })
}
/**
 * 加入群聊
 */
export function joinGroupChat(data: { id: number }) {
  return bpost({
    url: "chatGroup/applyJoin",
    data,
  })
}
/**
 * todo 获取成员列表
 *  filter{
 *  groupId:{
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
          id: 403,
          isAdmin: true,
          name: "阿萨德1",
          avatar: {
            id: 1,
            title: "",
            url: "/uploads/20190528/14151cac19744c03114114ed6c9b3cea.jpg",
          },
        },
        {
          id: 2,
          isAdmin: true,
          name: "阿萨德2",
          avatar: {
            id: 1,
            title: "",
            url: "/uploads/20190528/14151cac19744c03114114ed6c9b3cea.jpg",
          },
        },
        {
          id: 3,
          isAdmin: false,
          name: "阿萨德3",
          avatar: {
            id: 1,
            title: "",
            url: "/uploads/20190528/14151cac19744c03114114ed6c9b3cea.jpg",
          },
        },
        {
          id: 4,
          isAdmin: false,
          name: "阿萨德4",
          avatar: {
            id: 1,
            title: "",
            url: "/uploads/20190528/14151cac19744c03114114ed6c9b3cea.jpg",
          },
        },
      ] as Assign<GroupChatMember, { active: boolean }>[],
      applyList: [
        {
          id: 1,
          name: "阿萨德1",
          avatar: {
            id: 1,
            title: "",
            url: "/uploads/20190528/14151cac19744c03114114ed6c9b3cea.jpg",
          },
        },
        {
          id: 2,
          name: "阿萨德2",
          avatar: {
            id: 1,
            title: "",
            url: "/uploads/20190528/14151cac19744c03114114ed6c9b3cea.jpg",
          },
        },
      ],
    },
  }
  // return bpost<{data:{list:Assign<GroupChatMember, { active: boolean }>[]}}>({
  //   url:"api/listGroupChatMember",
  //   data
  // })
}

/**
 * todo 删除某群的成员
 */
export function delGroupChatmember(data: { groupId: number; ids: number[] }) {
  return bpost({
    url: "api/delGroupChatmember",
    data,
  })
}
/**
 * todo 添加文章
 */
export function addArticle(data: { title: string; content: string; picList: Picture[] }) {
  return bpost<{ id: number }>({
    url: "api/addArticle",
    data,
  })
}
/**
 *todo  编辑文章
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
 *
 * filter:{
 * type:{
 *   condition:eq,
 *   val:ArticleType  //全部  个人
 * },
 *  search:{
 *    condition:eqString,
 *    val:string
 * },
 * }
 */
export function listArticle(data: GetListParam) {
  return bpost<{ data: { list: Article[] } }>({
    url: "chatGroup/listArticle",
    data,
  })
}
/**
 * todo 获取文章详情
 */
export function getArticle(data: { id: number }) {
  console.log(data)
  return {
    data: {
      detail: {
        id: 1,
        title: "广东省中西医结合学会肾病委...",
        author: {
          uid: 403,
          name: "",
          phone: "",
        },
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
 * todo 拒绝申请
 */
export function rejectJoin(data: { id: number; groupId: number }) {
  return bpost({
    url: "api/rejectJoin",
    data,
  })
}
/**
 * todo 拒绝申请
 */
export function agreeJoin(data: { id: number; groupId: number }) {
  return bpost({
    url: "api/agreeJoin",
    data,
  })
}
export default {
  listGroupChat,
}
