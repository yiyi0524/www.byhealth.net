import * as userAction from '../actions/user'
import { Picture } from '@/pages/advisory/Chat'
import { PrescriptionDrugCategory } from '@/pages/advisory/SquareRoot'
export interface CurrSetPrescription {
  // 辨病
  discrimination: string
  // 辨证
  syndromeDifferentiation: string
  // 服务费
  serviceMoney: string
  // 医嘱
  advice: string
  // 药品信息
  prescriptionDrugCategoryList: PrescriptionDrugCategory[]
}
export interface UserState {
  isLogin: boolean
  name: string
  uid: number
  avatar: Picture
  currSetPrescription: Record<number, CurrSetPrescription | null>
}
// const initCurrSetPrescription = {
//   advice: "",
//   discrimination: "",
//   prescriptionDrugCategoryList: [],
//   serviceMoney: "",
//   syndromeDifferentiation: "",
// }
const initState: UserState = {
  isLogin: false,
  uid: 0,
  name: '未命名',
  avatar: {
    id: 0,
    title: '',
    url: '',
  },
  currSetPrescription: {},
}
export interface Action<T> {
  type: string
  preload: T
}
function saveCurrSetPrescription(state = initState, action: Action<[number, CurrSetPrescription | null]>) {
  if (action.type === userAction.SAVE_CURR_SET_PRESCRIPTION) {
    let newState = Object.assign({}, state)
    newState.currSetPrescription[action.preload[0]] = action.preload[1]
    return newState
  }
  return state
}
function delCurrSetPrescription(state = initState, action: Action<number>) {
  if (action.type === userAction.DEL_CURR_SET_PRESCRIPTION) {
    let newState = Object.assign({}, state)
    delete newState.currSetPrescription[action.preload]
    return newState
  }
  return state
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
    case userAction.SAVE_CURR_SET_PRESCRIPTION:
      return saveCurrSetPrescription(state, action)
    case userAction.DEL_CURR_SET_PRESCRIPTION:
      return delCurrSetPrescription(state, action)
    default:
      break
  }
  return state
}
