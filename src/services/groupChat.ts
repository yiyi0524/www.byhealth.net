import { Picture } from "@/pages/advisory/Chat"
import { Assign } from "utility-types"
import { bpost, GetListParam, bget } from "./api"

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
 * 获取某群聊列表  排序:管理员在前
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
 * todo 删除
 *  filter{
 *  groupId:{
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
 * todo 删除
 */
export function checkGroupChatAdministrators(data: { groupId: number }) {
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
export function delGroupChatmember(data: { groupId: number; ids: number[] }) {
  return bpost({
    url: "api/delGroupChatmember",
    data,
  })
}
/**
 * 添加文章
 */
export function addArticle(data: { title: string; content: string; picList: Picture[] }) {
  return bpost<{ id: number }>({
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
 * 检查是否为自己的文章
 * todo 删除
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
