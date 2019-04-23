import { Msg } from "@/pages/Ws"

export interface WsInfo {
  status: number
}
export const CHANGE_STATUS = "改变websocket状态"
export const ADD_MSG = "新增消息"

export function changeStatus({ status }: { status: number }) {
  return {
    type: CHANGE_STATUS,
    preload: {
      status,
    },
  }
}
export function addMsg(msg: Msg) {
  return {
    type: ADD_MSG,
    preload: {
      msg,
    },
  }
}
