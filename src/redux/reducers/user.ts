import * as userAction from "../actions/user"
import { Picture } from "@/pages/advisory/Chat"
export interface UserState {
  isLogin: boolean
  name: string
  uid: number
  avatar: Picture
}
const initState: UserState = {
  isLogin: false,
  uid: 0,
  name: "未命名",
  avatar: {
    id: 0,
    title: "",
    url: "",
  },
}
export interface Action<T> {
  type: string
  preload: T
}
function userLogin(state = initState, action: Action<userAction.UserInfo>) {
  if (action.type === userAction.USER_LOGIN) {
    let newState = Object.assign({}, state)
    newState.isLogin = true
    newState.name = action.preload.name
    newState.uid = action.preload.uid
    newState.avatar = action.preload.avatar
    return newState
  }
  return state
}

export default function reducer(state = initState, action: Action<any>) {
  switch (action.type) {
    case userAction.USER_LOGIN:
      return userLogin(state, action)
    default:
      break
  }
  return state
}
