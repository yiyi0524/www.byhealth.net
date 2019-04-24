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
        type: 2,
        msg: "您好",
        pic: {
          id: 0,
          title: "",
          url: "/uploads/20190315/cee606bdbfcffc69950777cb3d5d84f1.png",
        },
        sendTime: "2018-12-12 12:00:00",
        extraData: {
          patient: {
            id: 16,
            name: "孟磊",
            gender: 1,
            yearAge: 3,
            monthAge: 0,
          },
          orderId: 2,
          ctime: "2019-04-23 15:39:33",
        },
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
      {
        id: 5,
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
        type: 3,
        msg: "您好",
        pic: {
          id: 0,
          title: "",
          url: "",
        },
        sendTime: "2018-12-12 12:00:00",
        extraData: {
          patient: {
            id: 16,
            name: "孟磊",
            gender: 1,
            yearAge: 2,
            monthAge: 11,
            weight: 60,
            height: 175,
            provinceCid: "310000000000",
            state: "头疼", //用户情况 症状和病情
            allergyHistory: "无", //病史
            medicalHistory: "青霉素过敏", //病史
            tongueCoatingPics: [
              {
                title: "",
                url: "/uploads/20190322/e049282da2c90aa6e0866e66d42ad110.png",
                id: 1,
              },
            ], //舌苔照
          },
        },
      },
      {
        id: 6,
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
        type: 4,
        msg: "您好",
        pic: {
          id: 0,
          title: "",
          url: "",
        },
        sendTime: "2018-12-12 12:00:00",
        extraData: {
          id: 2,
          patient: {
            uid: 3,
            name: "孟磊",
            gender: 1,
            yearAge: 3,
            monthAge: 4,
            discrimination: "感冒", //辨病
            syndromeDifferentiation: "发烧, 头痛", //辩证
          },
          orderId: 2,
          ctime: "2019-04-23 13:44:55",
        },
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
