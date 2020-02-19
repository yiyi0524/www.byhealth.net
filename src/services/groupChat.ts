import { Picture } from '@/pages/advisory/Chat'
import { bget, bpost, GetListParam } from './api'

export const TAB = {
  GROUP_CHAT: 0x0,
  MY_GROUP_CHAT: 0x1,
}
export const TAB_ZH = {
  [TAB.GROUP_CHAT]: '精选群聊',
  [TAB.MY_GROUP_CHAT]: '我加入的',
}
export const STATUS = {
  //是否加入 0 :未加入 1:加入
  notJoined: 'notJoined',
  joined: 'joined',
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
  userList: GroupChatMember[]
  applyList: Omit<GroupChatMember, 'isAdmin'>[]
  description: string //群简介
  ctime: string
}
//群聊成员
export interface GroupChatMember {
  id: number
  uid: number
  isAdmin: boolean
  nick: string
  avatar: Picture
  phone: string
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
    url: 'chatGroup/list',
    query,
  })
}
/**
 * 加入群聊
 */
export function joinGroupChat(data: { id: number }) {
  return bpost({
    url: 'chatGroup/applyJoin',
    data,
  })
}

/**
 *  删除某群的成员
 */
export function delGroupChatmember(data: { groupId: number; ids: number[] }) {
  return bpost({
    url: 'chatGroup/delMember',
    data: {
      id: data.groupId,
      doctorIds: data.ids,
    },
  })
}
/**
 *  添加文章
 */
export function addArticle(data: { title: string; content: string; picIdList: number[] }) {
  return bpost<{ id: number }>({
    url: 'chatGroup/addArticle',
    data,
  })
}
/**
 *  编辑文章
 */
export function editArticle(data: { id: number; title: string; content: string; picIdList: number[] }) {
  return bpost({
    url: 'chatGroup/editArticle',
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
export function listArticle(query: GetListParam) {
  return bget<{ list: Article[] }>({
    url: 'chatGroup/listArticle',
    query,
  })
}
/**
 * 获取文章详情
 */
export function getArticle(query: { id: number }) {
  return bget<{ detail: Article }>({
    url: 'chatGroup/detailArticle',
    query,
  })
}
/**
 *  拒绝申请
 */
export function rejectJoin(data: { id: number; groupId: number }) {
  return bpost({
    url: 'chatGroup/denyJoin',
    data: {
      id: data.groupId,
      doctorIds: [data.id],
    },
  })
}
/**
 *  同意申请
 */
export function agreeJoin(data: { id: number; groupId: number }) {
  return bpost({
    url: 'chatGroup/allowJoin',
    data: {
      id: data.groupId,
      doctorIds: [data.id],
    },
  })
}
/**
 *  删除文章
 */
export function delArticle(data: { id: number }) {
  return bpost<{ detail: Article }>({
    url: 'chatGroup/delArticle',
    data: {
      idArr: [data.id],
    },
  })
}
export default {
  listGroupChat,
}
