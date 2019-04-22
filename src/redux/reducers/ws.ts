import * as wsAction from "../actions/ws"
export interface WsState {
  status: number
}
const initState: WsState = {
  // websocket 状态
  status: WebSocket.CLOSED,
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
export default function reducer(state = initState, action: Action<any>) {
  switch (action.type) {
    case wsAction.CHANGE_STATUS:
      return changeStatus(state, action)
    default:
      break
  }
  return state
}
