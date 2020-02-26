import { Msg } from '@/pages/Ws'
import { Toast } from '@ant-design/react-native'
import * as wsAction from '../actions/ws'
type Uid = number
type GroupId = number
type UnReadMsgCount = number
export interface WsState {
  currScreen: string
  currChatUid: number
  currGroupId: number
  status: number
  // 未读消息数量统计
  unReadMsgCountRecord: Record<Uid, UnReadMsgCount>
  chatMsg: Record<number, Msg[]>
  // 未读群聊消息数量统计
  unReadGroupMsgCountRecord: Record<GroupId, UnReadMsgCount>
  groupMsg: Record<number, Msg[]>
  wsGet: (data: { url: string; query?: Object }) => boolean
  wsPost: (data: { url: string; data?: Object }) => boolean
  reveiveMsgCallback: (type: 'common' | 'chatGroup', subjectId: number) => void
}
export const initState: WsState = {
  currScreen: '',
  currChatUid: 0,
  currGroupId: 0,
  // websocket 状态
  status: WebSocket.CLOSED,
  unReadMsgCountRecord: {},
  chatMsg: {},
  groupMsg: {},
  unReadGroupMsgCountRecord: {},
  wsGet: ({ url, query = {} }) => {
    console.log(query)
    if (url !== '/ws/ping') {
      Toast.info('未连接到服务器,无法发送消息')
    }
    return false
  },
  wsPost: ({ url, data = {} }) => {
    console.log(data)
    if (url !== '/ws/ping') {
      Toast.info('未连接到服务器,无法发送消息')
    }
    return false
  },
  reveiveMsgCallback: () => {},
}
export interface Action<T> {
  type: string
  preload: T
}

/**
 * 改变 ws 状态
 */
function setWsFn(state = initState, action: Action<{ wsGet: WsState['wsGet']; wsPost: WsState['wsPost'] }>) {
  if (action.type === wsAction.SET_WS_FN) {
    let newState = Object.assign({}, state)
    newState.wsGet = action.preload.wsGet
    newState.wsPost = action.preload.wsPost
    return newState
  }
  return state
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
/**
 * 添加一条消息
 */
function addMsg(state = initState, action: Action<wsAction.MsgPreload>) {
  if (action.type === wsAction.ADD_MSG) {
    let { uid } = action.preload
    let chatMsg: Record<number, Msg[]> = Object.assign({}, state.chatMsg)
    if (uid in state.chatMsg) {
      chatMsg[uid] = [...state.chatMsg[uid]]
    }
    let newState = Object.assign({}, state, {
      chatMsg,
    })
    state.reveiveMsgCallback('common', uid)
    if (uid in state.chatMsg) {
      newState.chatMsg[uid].push(action.preload.msg)
    } else {
      newState.chatMsg[uid] = [action.preload.msg]
    }
    return newState
  }
  return state
}
/**
 * 前部插入消息列表,此记录插入与同一个用户聊天记录
 */
function addMsgList(state = initState, action: Action<{ uid: number; msgList: Msg[] }>) {
  if (action.type === wsAction.ADD_MSG_LIST) {
    let newState = Object.assign({}, state, { chatMsg: { ...state.chatMsg } })
    const { msgList, uid } = action.preload
    if (msgList.length === 0) {
      return state
    }
    if (uid in state.chatMsg) {
      newState.chatMsg[uid].unshift(...action.preload.msgList.reverse())
    } else {
      newState.chatMsg[uid] = action.preload.msgList.reverse()
    }
    return newState
  }
  return state
}

/**
 * 添加一条群组消息
 */
function addGroupMsg(state = initState, action: Action<wsAction.GroupMsgPreload>) {
  if (action.type === wsAction.ADD_GROUP_MSG) {
    let { groupId } = action.preload
    let groupMsg: Record<number, Msg[]> = Object.assign({}, state.groupMsg)
    if (groupId in state.groupMsg) {
      groupMsg[groupId] = [...state.groupMsg[groupId]]
    }
    let newState = Object.assign({}, state, {
      groupMsg,
    })
    state.reveiveMsgCallback('chatGroup', groupId)
    if (groupId in state.groupMsg) {
      newState.groupMsg[groupId].push(action.preload.msg)
    } else {
      newState.groupMsg[groupId] = [action.preload.msg]
    }
    return newState
  }
  return state
}
/**
 * 前部插入消息列表,此记录插入与同一个用户聊天记录
 */
function addGroupMsgList(state = initState, action: Action<wsAction.GroupMsgListPreload>) {
  if (action.type === wsAction.ADD_GROUP_MSG_LIST) {
    let newState = Object.assign({}, state, { groupMsg: { ...state.groupMsg } })
    const { msgList, groupId } = action.preload
    if (msgList.length === 0) {
      return state
    }
    if (groupId in state.groupMsg) {
      newState.groupMsg[groupId].unshift(...action.preload.msgList.reverse())
    } else {
      newState.groupMsg[groupId] = action.preload.msgList.reverse()
    }
    return newState
  }
  return state
}
/**
 * 设置与某用户的未读消息数量
 */
function setUserUnReadMsgCount(state = initState, action: Action<{ uid: number; count: number }>) {
  if (action.type === wsAction.SET_USER_UNREAD_MSG_COUNT) {
    let newState = Object.assign({}, state)
    let { uid, count } = action.preload
    if (uid in newState.unReadMsgCountRecord && count === 0) {
      delete newState.unReadMsgCountRecord[uid]
    } else {
      newState.unReadMsgCountRecord[uid] = count
    }
    return newState
  }
  return state
}
/**
 * 设置与某用户的未读消息数量
 */
function setGroupUnReadMsgCount(state = initState, action: Action<{ groupId: number; count: number }>) {
  let newState = Object.assign({}, state)
  let { groupId, count } = action.preload
  if (groupId in newState.unReadGroupMsgCountRecord && count === 0) {
    delete newState.unReadGroupMsgCountRecord[groupId]
  } else {
    newState.unReadGroupMsgCountRecord[groupId] = count
  }
  return newState
}
/**
 * 改变当前屏幕
 */
function changeScreen(state = initState, action: Action<{ screenName: string }>) {
  if (state.currScreen !== action.preload.screenName) {
    return Object.assign({}, state, { currScreen: action.preload.screenName })
  }
  return state
}
/**
 * 设置当前聊天的用户uid
 */
function setCurrChatUid(state = initState, action: Action<{ uid: number }>) {
  if (action.type === wsAction.SET_CURR_CHAT_UID) {
    let newState = Object.assign({}, state, { currChatUid: action.preload.uid })
    return newState
  }
  return state
}
/**
 * 设置当前聊天的群组id
 */
function setCurrGroupId(state = initState, action: Action<{ groupId: number }>) {
  return Object.assign({}, state, { currGroupId: action.preload.groupId })
}
/**
 * 设置接收消息的回调函数
 */
function setReceiveCallback(state = initState, action: Action<{ fn: () => void }>) {
  return Object.assign({}, state, { reveiveMsgCallback: action.preload.fn })
}
export default function reducer(state = initState, action: Action<any>) {
  switch (action.type) {
    case wsAction.CHANGE_STATUS:
      return changeStatus(state, action)
    case wsAction.ADD_MSG:
      return addMsg(state, action)
    case wsAction.ADD_GROUP_MSG:
      return addGroupMsg(state, action)
    case wsAction.ADD_MSG_LIST:
      return addMsgList(state, action)
    case wsAction.ADD_GROUP_MSG_LIST:
      return addGroupMsgList(state, action)
    case wsAction.SET_WS_FN:
      return setWsFn(state, action)
    case wsAction.SET_USER_UNREAD_MSG_COUNT:
      return setUserUnReadMsgCount(state, action)
    case wsAction.SET_GROUP_UNREAD_MSG_COUNT:
      return setGroupUnReadMsgCount(state, action)
    case wsAction.CHANGE_SCREEN:
      return changeScreen(state, action)
    case wsAction.SET_CURR_CHAT_UID:
      return setCurrChatUid(state, action)
    case wsAction.SET_RECEIVE_CB:
      return setReceiveCallback(state, action)
    case wsAction.SET_CURR_GROUP_ID:
      return setCurrGroupId(state, action)
    default:
      break
  }
  return state
}
