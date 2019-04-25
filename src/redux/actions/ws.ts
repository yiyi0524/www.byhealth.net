import { Msg } from "@/pages/Ws"
import { WsState } from "../reducers/ws"

export interface WsInfo {
  status: number
}
export interface MsgListPreload {
  uid: number
  msgList: Msg[]
}
export interface WsFnPreload {
  wsGet: WsState["wsGet"]
  wsPost: WsState["wsPost"]
}
export interface MsgPreload {
  uid: number
  msg: Msg
}
export const CHANGE_STATUS = "改变websocket状态"
export const ADD_MSG = "新增消息"
export const ADD_MSG_LIST = "新增消息列表"
export const SET_WS_FN = "设置ws 函数"

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
export function addList(preload: MsgListPreload) {
  return {
    type: ADD_MSG_LIST,
    preload,
  }
}
export function setWsFn(preload: WsFnPreload) {
  return {
    type: SET_WS_FN,
    preload,
  }
}
