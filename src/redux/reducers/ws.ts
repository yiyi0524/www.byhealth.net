import * as wsAction from "../actions/ws"
import { Msg } from "@/pages/Ws"
export interface WsState {
  status: number
  chatMsg: Record<number, Msg[]>
}
const initState: WsState = {
  // websocket 状态
  status: WebSocket.CLOSED,
  chatMsg: {},
}
export interface Action<T> {
  type: string
  preload: T
}
/**
 * 改变 ws 状态
 */
function changeStatus(state = initState, action: Action<{ status: number }>) {
  if (action.type === wsAction.CHANGE_STATUS) {
    let newState = Object.assign({}, state)
    newState.status = action.preload.status
    return newState
  }
  return state
}
function addMsg(state = initState, action: Action<{ msg: Msg }>) {
  if (action.type === wsAction.ADD_MSG) {
    let newState = Object.assign({}, state, { chatMsg: { ...state.chatMsg } })
    let { sendUser } = action.preload.msg
    if (sendUser.uid in state.chatMsg) {
      newState.chatMsg[sendUser.uid].push(action.preload.msg)
    } else {
      newState.chatMsg[sendUser.uid] = [action.preload.msg]
    }
    console.log(newState)
    return newState
  }
  return state
}
export default function reducer(state = initState, action: Action<any>) {
  switch (action.type) {
    case wsAction.CHANGE_STATUS:
      return changeStatus(state, action)
    case wsAction.ADD_MSG:
      return addMsg(state, action)
    default:
      break
  }
  return state
}
