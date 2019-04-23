import React, { ReactChild } from "react"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import * as wsAction from "@redux/actions/ws"
import { AppState } from "@/redux/stores/store"
import { WSS_URL } from "@/config/api"
import storage from "@/utils/storage"
import { Picture } from "./advisory/Chat"
import { Overwrite } from "utility-types"
import { JsonReturnCode } from "@/services/api"
/**
 * 枚举类型
 */
export enum MsgType {
  txt,
  picture,
  inquirySheet, //问诊单
  patientsThemselves, //患者信息
  treatmentPlan, //治疗方案
}
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
  type: MsgType
  msg?: string
  extraData?: T
  pic?: Picture
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
    syndromeDifferentiation: string //辩证
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
    addMsg: (preload: Msg) => {
      dispatch(wsAction.addMsg(preload))
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
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
    this.evtMapFn = {
      [EVT.pong]: () => {
        console.log("接收到pong消息")
      },
      [EVT.receiveMsg]: this.receiveMsg,
    }
  }
  getInitState = (): State => {
    return {}
  }
  componentDidMount() {
    this.checkIsLoginTimer = setInterval(this.checkLoginStatus, 1000)
    this.init()
  }
  componentWillUnmount() {
    let { checkIsLoginTimer, pingTimer } = this
    checkIsLoginTimer && clearInterval(checkIsLoginTimer)
    pingTimer && clearInterval(pingTimer)
  }
  init = async () => {
    let session = await storage.get("session")
    this.cookie.PHPSESSID = session
  }
  /**
   * 检查登录状态
   */
  checkLoginStatus = () => {
    // 如果已登录则检查ws连接状态
    if (this.userIsLogin()) {
      if (!this.wsIsConnect()) {
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
    return !!this.client && this.client.readyState === this.client.OPEN
  }
  receiveMsg = (frame: ReceiveFrame<Exclude<Overwrite<Msg, MsgOptionalDataToRequired>, "dom">>) => {
    this.props.addMsg(frame.data)
  }
  initClient = async () => {
    if (this.clientIsConnect || this.client) {
      return
    }
    let sessionId = await storage.get("session")
    let wsUrl = WSS_URL + "?sessionId=" + sessionId
    this.clientIsConnect = true
    this.client = new WebSocket(wsUrl)
    this.clientIsConnect = false
    this.client.onopen = this.onOpen
    this.client.onerror = this.onError
    this.client.onmessage = this.onMessage
    this.client.onclose = this.onClose
    this.pingTimer = setInterval(this.ping, 30000)
  }
  reConnect = () => {
    if (!this.wsIsConnect()) {
      this.initClient()
    }
  }
  receiveErrMsg = (frame: ReceiveFrame<any>) => {
    console.log("发生了错误: ", frame.msg)
  }
  /**
   * 当ws断开的时候 关闭ping计时器,如果应该重连,则1s后重连
   */
  onClose = (_: CloseEvent) => {
    let { client } = this
    if (this.pingTimer) {
      clearInterval(this.pingTimer)
    }
    if (!client) {
      return
    }
    this.props.changeWsStatus({ status: client.readyState })
    if (this.shouldReConnect) {
      setTimeout(this.reConnect, 1000)
    }
  }
  onError = (evt: Event) => {
    console.log("socket 有错误", evt)
  }
  onMessage = (evt: MessageEvent) => {
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
        if (!(json as Object).hasOwnProperty("code")) {
          throw new Error(JSON.stringify(json))
        }
      } catch (e) {
        return console.log("ws服务器返回的不是正确的格式", e)
      }
      if (json.code !== JsonReturnCode.SUCCESS) {
        return this.receiveErrMsg(json)
      }
      if (json.event in this.evtMapFn) {
        this.evtMapFn[json.event](json)
      }
    } catch (e) {
      console.log("处理服务器消息错误", e)
    }
  }
  onOpen = (_: Event) => {
    let { client } = this
    if (!client) {
      return
    }
    this.props.changeWsStatus({ status: client.readyState })
  }
  ping = (): boolean => {
    return this.wsGet({ url: "/ws/ping" })
  }
  close = () => {
    this.shouldReConnect = false
    this.client && this.client.close()
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
  wsPost = ({ url, data = {} }: { url: string; data: {} }): boolean => {
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
      console.log("未连接,无法发送消息")
      return false
    }
    frame.arguments = frame.arguments || {}
    frame.arguments.cookie = this.cookie
    frame.arguments.post = frame.arguments.post || {}
    this.client.send(JSON.stringify(frame))
    return true
  }
  render() {
    return this.props.children
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Ws)
