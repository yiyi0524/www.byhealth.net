import { Msg } from '@/pages/Ws'
import { WsState } from '../reducers/ws'

export interface WsInfo {
  status: number
}
export interface MsgListPreload {
  uid: number
  msgList: Msg[]
}
export interface GroupMsgListPreload {
  groupId: number
  msgList: Msg[]
}
export interface WsFnPreload {
  wsGet: WsState['wsGet']
  wsPost: WsState['wsPost']
}
export interface MsgPreload {
  uid: number
  msg: Msg
}
export interface GroupMsgPreload {
  groupId: number
  msg: Msg
}
export const CHANGE_STATUS = '改变websocket状态'
export const ADD_MSG = '新增消息'
export const ADD_GROUP_MSG = '新增群聊消息'
export const ADD_MSG_LIST = '新增消息列表'
export const ADD_GROUP_MSG_LIST = '新增群聊消息列表'
export const SET_WS_FN = '设置ws 函数'
export const SET_USER_UNREAD_MSG_COUNT = '改变与指定用户的未读消息数量'
export const SET_GROUP_UNREAD_MSG_COUNT = '改变与指定群组的未读消息数量'
export const CHANGE_SCREEN = '设置当前screen'
export const SET_CURR_CHAT_UID = '设置当前聊天的患者uid'
export const SET_CURR_GROUP_ID = '设置当前聊天的群组id'
export const SET_RECEIVE_CB = '设置接收消息的回调函数'

export function changeScreen(preload: { screenName: string }) {
  return {
    type: CHANGE_SCREEN,
    preload,
  }
}

export function setCurrChatUid(preload: { uid: number }) {
  return {
    type: SET_CURR_CHAT_UID,
    preload,
  }
}
export function setCurrGroupId(preload: { groupId: number }) {
  return {
    type: SET_CURR_GROUP_ID,
    preload,
  }
}

export function changeStatus({ status }: { status: number }) {
  return {
    type: CHANGE_STATUS,
    preload: {
      status,
    },
  }
}
export function addMsg(preload: MsgPreload) {
  return {
    type: ADD_MSG,
    preload,
  }
}
export function addGroupMsg(preload: GroupMsgPreload) {
  return {
    type: ADD_GROUP_MSG,
    preload,
  }
}
export function addList(preload: MsgListPreload) {
  return {
    type: ADD_MSG_LIST,
    preload,
  }
}
export function addGroupList(preload: GroupMsgListPreload) {
  return {
    type: ADD_GROUP_MSG_LIST,
    preload,
  }
}
export function setWsFn(preload: WsFnPreload) {
  return {
    type: SET_WS_FN,
    preload,
  }
}
export function setUserUnReadMsgCount(preload: { uid: number; count: number }) {
  return {
    type: SET_USER_UNREAD_MSG_COUNT,
    preload,
  }
}
export function setGroupUnReadMsgCount(preload: { groupId: number; count: number }) {
  return {
    type: SET_GROUP_UNREAD_MSG_COUNT,
    preload,
  }
}
export function setReceiveMsgCb(preload: { fn: (type: 'common' | 'chatGroup', subjectId: number) => void }) {
  return {
    type: SET_RECEIVE_CB,
    preload,
  }
}
