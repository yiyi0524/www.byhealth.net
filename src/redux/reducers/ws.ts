import * as wsAction from "../actions/ws"
import { Msg } from "@/pages/Ws"
export interface WsState {
  status: number
  chatMsg: Record<number, Msg[]>
}
const initState: WsState = {
  // websocket 状态
  status: WebSocket.CLOSED,
  chatMsg: {
    16: [
      {
        id: 1,
        sendUser: {
          uid: 5,
          avatar: {
            id: 0,
            title: "",
            url: "/uploads/20190315/cee606bdbfcffc69950777cb3d5d84f1.png",
          },
          name: "吴大伟",
        },
        receiveUser: {
          uid: 2,
          avatar: {
            id: 0,
            title: "",
            url: "",
          },
          name: "吴伟伟",
        },
        type: 1,
        msg: "您好您好您好您好",
        pic: {
          id: 0,
          title: "",
          url: "/uploads/20190315/cee606bdbfcffc69950777cb3d5d84f1.png",
        },
        sendTime: "2018-12-12 12:00:00",
      },
      {
        id: 2,
        sendUser: {
          uid: 5,
          avatar: {
            id: 0,
            title: "",
            url: "/uploads/20190315/cee606bdbfcffc69950777cb3d5d84f1.png",
          },
          name: "吴大伟",
        },
        receiveUser: {
          uid: 2,
          avatar: {
            id: 0,
            title: "",
            url: "",
          },
          name: "吴伟伟",
        },
        type: 0,
        msg:
          "您好您好您好您好您好您好您好您好您好您好您好您好您好您好您好您好您好您好您好您好您好您好您好您好",
        pic: {
          id: 0,
          title: "",
          url: "",
        },
        sendTime: "2018-12-12 12:00:00",
      },
      {
        id: 3,
        sendUser: {
          uid: 11,
          avatar: {
            id: 0,
            title: "",
            url: "/uploads/20190315/cee606bdbfcffc69950777cb3d5d84f1.png",
          },
          name: "吴大伟",
        },
        receiveUser: {
          uid: 2,
          avatar: {
            id: 0,
            title: "",
            url: "",
          },
          name: "吴伟伟",
        },
        type: 1,
        msg: "您好",
        pic: {
          id: 0,
          title: "",
          url: "/uploads/20190315/cee606bdbfcffc69950777cb3d5d84f1.png",
        },
        sendTime: "2018-12-12 12:00:00",
      },
      {
        id: 4,
        sendUser: {
          uid: 11,
          avatar: {
            id: 0,
            title: "",
            url: "/uploads/20190315/cee606bdbfcffc69950777cb3d5d84f1.png",
          },
          name: "吴大伟",
        },
        receiveUser: {
          uid: 2,
          avatar: {
            id: 0,
            title: "",
            url: "",
          },
          name: "吴伟伟",
        },
        type: 0,
        msg: "您好",
        pic: {
          id: 0,
          title: "",
          url: "",
        },
        sendTime: "2018-12-12 12:00:00",
      },
    ],
  },
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
    let { sendUser } = action.preload.msg
    let newState = Object.assign({}, state, {
      chatMsg: { [sendUser.uid]: [...state.chatMsg[sendUser.uid]], ...state.chatMsg },
    })
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
function addMsgList(state = initState, action: Action<{ msg: Msg }>) {
  if (action.type === wsAction.ADD_MSG_LIST) {
    let { sendUser } = action.preload.msg
    let newState = Object.assign({}, state, {
      chatMsg: { [sendUser.uid]: [...state.chatMsg[sendUser.uid]], ...state.chatMsg },
    })
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
    case wsAction.ADD_MSG_LIST:
      return addMsgList(state, action)
    default:
      break
  }
  return state
}
