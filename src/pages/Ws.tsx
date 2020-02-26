import { WSS_URL } from '@/config/api'
import { AppState } from '@/redux/stores/store'
import { JsonReturnCode } from '@/services/api'
import storage from '@/utils/storage'
import { Toast } from '@ant-design/react-native'
import * as wsAction from '@redux/actions/ws'
import React, { ReactChild } from 'react'
import { AppState as RnAppState, DeviceEventEmitter, EmitterSubscription } from 'react-native'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Overwrite } from 'utility-types'
import { MsgType, Picture, File } from './advisory/Chat'
import pathMap from '@/routes/pathMap'
/**
 * 一条消息
 */
export interface Msg<T = any> {
  id: number
  sendUser: {
    uid: number
    avatar: Picture
    name: string
  }
  receiveUser: {
    uid: number
    avatar: Picture
    name: string
  }
  receiveGroup?: {
    id: number
    avatar: Picture
    name: string
  }
  type: MsgType
  msg?: string
  extraData?: T
  pic?: Picture
  file?: File
  dom?: ReactChild
  sendTime: string
}
export interface MsgOptionalDataToRequired<T = any> {
  msg: string
  extraData: T
  pic: Picture
  dom: ReactChild
}
export interface SendFrame {
  url: string //目标地址
  arguments?: {
    post?: Record<string, any> //post数据
    get?: Record<string, any> //get数据
    cookie?: Record<string, any> //cookie数据
  }
}

export interface ReceiveFrame<T> {
  code: number
  event: number
  msg: string
  data: T
  count: number
}
/**
 * 事件
 */
export enum EVT {
  pong,
  receiveMsg,
  closeInquiry,
}
/**
 * 当消息为问诊单时 附加信息类型
 */
export interface MsgInquirySheetData {
  patient: {
    id: number
    name: string
    gender: number
    yearAge: number
    monthAge: number
  }
  orderId: number
  ctime: string
}
/**
 *  患者自述
 */
export interface patientsThemselves {
  patient: {
    id: number
    name: string
    gender: number
    yearAge: number
    monthAge: number
  }
  orderId: number
  ctime: string
}
/**
 * 治疗方案
 */
export interface TreatmentPlan {
  id: number
  patient: {
    uid: number
    name: string
    gender: number
    yearAge: number
    monthAge: number
    discrimination: string //辨病
    syndromeDifferentiation: string //辨证
  }
  orderId: number
  ctime: string
}
interface Props {}
interface State {}
const mapStateToProps = (state: AppState) => {
  return {
    isLogin: state.user.isLogin,
    name: state.user.name,
    uid: state.user.uid,
    ws: state.ws,
  }
}
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    changeWsStatus: (preload: { status: number }) => {
      dispatch(wsAction.changeStatus(preload))
    },
    addMsg: (preload: wsAction.MsgPreload) => {
      dispatch(wsAction.addMsg(preload))
    },
    addGroupMsg: (preload: wsAction.GroupMsgPreload) => {
      dispatch(wsAction.addGroupMsg(preload))
    },
    setWsFn: (preload: wsAction.WsFnPreload) => {
      dispatch(wsAction.setWsFn(preload))
    },
    setUserUnReadMsgCount: (preload: { uid: number; count: number }) => {
      dispatch(wsAction.setUserUnReadMsgCount(preload))
    },
    setGroupUnReadMsgCount: (preload: { groupId: number; count: number }) => {
      dispatch(wsAction.setGroupUnReadMsgCount(preload))
    },
  }
}
class Ws extends React.Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  shouldReConnect = true
  clientIsConnect = false
  checkIsLoginTimer?: number
  pingTimer?: number
  client?: WebSocket
  evtMapFn: Record<number, (frame: ReceiveFrame<any>) => any>
  cookie: Record<string, string> = {}
  subscription?: EmitterSubscription
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
    this.evtMapFn = {
      [EVT.pong]: () => {
        console.log('接收到pong消息')
      },
      [EVT.receiveMsg]: this.receiveMsg,
    }
  }
  getInitState = (): State => {
    return {}
  }
  componentDidMount() {
    this.checkLoginStatus()
    // console.log("正在设置tick 定时器")
    this.checkIsLoginTimer = setInterval(this.checkLoginStatus, 1000)

    RnAppState.addEventListener('change', state => {
      console.log('状态改变', state)
      if (state === 'active') {
        if (!this.checkIsLoginTimer) {
          console.log('正在开启定时器')
          this.checkIsLoginTimer = setInterval(this.checkLoginStatus, 1000)
        }
      } else {
        if (this.checkIsLoginTimer) {
          console.log('正在关闭定时器')
          clearInterval(this.checkIsLoginTimer)
          this.checkIsLoginTimer = undefined
        }
      }
    })
    this.subscription = DeviceEventEmitter.addListener('wsReload', () => {
      if (this.client) {
        this.client.close()
      }
    })

    this.props.setWsFn({
      wsGet: this.wsGet,
      wsPost: this.wsPost,
    })
    this.init()
  }
  componentWillUnmount() {
    let { checkIsLoginTimer, pingTimer } = this
    if (checkIsLoginTimer) {
      clearInterval(checkIsLoginTimer)
    }
    if (pingTimer) {
      clearInterval(pingTimer)
    }
    RnAppState.removeEventListener('change', state => {
      // 我不知道这里为什么会要回调函数
      console.log(state)
    })
    if (this.subscription) {
      this.subscription.remove()
    }
  }
  init = async () => {
    let session = await storage.get('session')
    this.cookie.PHPSESSID = session
  }
  /**
   * 检查登录状态
   */
  checkLoginStatus = () => {
    // console.log("正在检查登录状态")
    if (RnAppState.currentState !== 'active') {
      console.log('当前未激活 返回')
      return
    }
    // 如果已登录则检查ws连接状态
    if (this.userIsLogin()) {
      // console.log("用户已登录")
      if (!this.wsIsConnect() && !this.clientIsConnect) {
        // console.log("当前ws 未连接,正在初始化wsClient")
        this.initClient()
      }
    }
  }
  /**
   * 用户是否已登录
   */
  userIsLogin = (): boolean => {
    return this.props.isLogin
  }
  /**
   * websocket 是否已连接
   */
  wsIsConnect = (): boolean => {
    return Boolean(this.client) && this.client!.readyState === WebSocket.OPEN
  }
  receiveMsg = (frame: ReceiveFrame<Exclude<Overwrite<Msg, MsgOptionalDataToRequired>, 'dom'>>) => {
    let { currChatUid, currScreen, unReadMsgCountRecord } = this.props.ws
    if (frame.data.receiveGroup) {
      return this.receiveGroupMsg(frame)
    }
    let patientUid = this.props.uid === frame.data.sendUser.uid ? frame.data.receiveUser.uid : frame.data.sendUser.uid
    this.props.addMsg({ uid: patientUid, msg: frame.data })
    // 如果当前页面不是聊天页面或者当前聊天的uid 不是 本条消息的患者uid 就把未读消息加1
    if (currScreen !== pathMap.AdvisoryChat || currChatUid !== patientUid) {
      console.log('ws238--- : ', currScreen, currChatUid, patientUid)
      let patientUnreadMsgCount = unReadMsgCountRecord[patientUid] || 0
      this.props.setUserUnReadMsgCount({ uid: patientUid, count: patientUnreadMsgCount + 1 })
    }
  }
  receiveGroupMsg = (frame: ReceiveFrame<Exclude<Overwrite<Msg, MsgOptionalDataToRequired>, 'dom'>>) => {
    console.log(frame)
    let { unReadGroupMsgCountRecord, currScreen, currGroupId } = this.props.ws
    let groupId = frame.data.receiveGroup!.id
    console.log('正在添加群聊消息')
    this.props.addGroupMsg({ groupId, msg: frame.data })
    if (currScreen !== pathMap.AdvisoryChat || currGroupId !== groupId) {
      let groupUnreadMsgCount = unReadGroupMsgCountRecord[groupId] || 0
      this.props.setGroupUnReadMsgCount({ groupId, count: groupUnreadMsgCount + 1 })
    }
  }
  initClient = async () => {
    console.log('正在初始化ws客户端')
    if (this.clientIsConnect) {
      console.log('客户端正在连接,已取消本次初始化client')
      return
    }
    this.clientIsConnect = true
    let sessionId = await storage.get('session')
    let wsUrl = WSS_URL + '?sessionId=' + sessionId
    this.client = new WebSocket(wsUrl)
    this.clientIsConnect = false
    this.client.onopen = this.onOpen
    this.client.onerror = this.onError
    this.client.onmessage = this.onMessage
    this.client.onclose = this.onClose
  }
  reConnect = () => {
    if (!this.wsIsConnect()) {
      this.initClient()
    }
  }
  receiveErrMsg = (frame: ReceiveFrame<any>) => {
    console.log('发生了错误: ', frame.msg)
  }
  /**
   * 当ws断开的时候 关闭ping计时器,如果应该重连,则1s后重连
   */
  onClose = (_: CloseEvent) => {
    console.log('ws is onClose')
    if (this.pingTimer) {
      clearInterval(this.pingTimer)
    }
    this.props.changeWsStatus({ status: WebSocket.CLOSED })
    // if (this.shouldReConnect) {
    //   if (!this.client || (this.client && this.client.readyState === WebSocket.CLOSED)) {
    //     console.log("正在重连")
    //     setTimeout(this.reConnect, 1000)
    //   }
    // }
  }
  onError = (evt: Event) => {
    console.log('socket 有错误', evt)
  }
  onMessage = (evt: MessageEvent) => {
    console.log(evt.data)
    let { client } = this
    if (!client) {
      return
    }
    this.props.changeWsStatus({ status: client.readyState })
    let { data } = evt
    let json: ReceiveFrame<any>
    try {
      try {
        json = JSON.parse(data)
        if (!(json as Object).hasOwnProperty('code')) {
          throw new Error(JSON.stringify(json))
        }
      } catch (e) {
        return console.log('ws服务器返回的不是正确的格式', e)
      }
      if (json.code !== JsonReturnCode.SUCCESS) {
        return this.receiveErrMsg(json)
      }
      if (json.event in this.evtMapFn) {
        this.evtMapFn[json.event](json)
      }
    } catch (e) {
      console.log('处理服务器消息错误', e)
    }
  }
  onOpen = (_: Event) => {
    console.log('onOpen')
    let { client } = this
    if (!client) {
      return
    }
    if (!this.pingTimer) {
      this.pingTimer = setInterval(this.ping, 30000)
    }
    this.props.changeWsStatus({ status: client.readyState })
  }
  ping = (): boolean => {
    return this.wsGet({ url: '/ws/ping' })
  }
  close = () => {
    this.shouldReConnect = false
    if (this.client) {
      this.client.close()
    }
    if (this.pingTimer) {
      clearInterval(this.pingTimer)
    }
  }
  wsGet = ({ url, query = {} }: { url: string; query?: {} }): boolean => {
    let frame: SendFrame = {
      url,
      arguments: {
        get: query,
      },
    }
    return this.sendMsg(frame)
  }
  wsPost = ({ url, data = {} }: { url: string; data?: {} }): boolean => {
    let frame: SendFrame = {
      url,
      arguments: {
        post: data,
      },
    }
    return this.sendMsg(frame)
  }
  sendMsg = (frame: SendFrame): boolean => {
    if (!this.client || !this.wsIsConnect()) {
      if (frame.url !== '/ws/ping') {
        Toast.fail('未连接,无法发送消息', 1)
      }
      return false
    }
    ;(async () => {
      let session = await storage.get('session')
      frame.arguments = frame.arguments || {}
      frame.arguments.cookie = this.cookie
      this.cookie.PHPSESSID = session
      frame.arguments.post = frame.arguments.post || {}
      if (this.client) {
        this.client.send(JSON.stringify(frame))
      }
    })()

    return true
  }
  render() {
    return this.props.children
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Ws)
