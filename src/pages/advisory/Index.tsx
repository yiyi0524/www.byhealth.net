import global from "@/assets/styles/global"
import { AppState } from "@/redux/stores/store"
import pathMap from "@/routes/pathMap"
import api from "@/services/api"
import doctor, { GENDER, ScanUser } from "@/services/doctor"
import { getPicCdnUrl } from "@/utils/utils"
import { Badge, Toast } from "@ant-design/react-native"
import Empty from "@components/Empty"
import * as wsAction from "@redux/actions/ws"
import Buff from "@utils/Buff"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import {
  DeviceEventEmitter,
  EmitterSubscription,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { Picture, MsgType } from "./Chat"
const style = gStyle.advisory.advisoryIndex
const globalStyle = gStyle.global

export interface ConsultationItem {
  isWaitReply: boolean
  isWaitBuyDrug: boolean
  id: number
  openid: string
  gender: number
  doctorUnreadMsgCount: number
  patientUid: number
  year_age: number
  month_age: number
  name: string
  currMsg: string
  currMsgTime: string
  avatar: Picture
}
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  consultationList: ConsultationItem[]
  scanUserList: ScanUser[]
}
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
    setUserUnReadMsgCount: (preload: { uid: number; count: number }) => {
      dispatch(wsAction.setUserUnReadMsgCount(preload))
    },
  }
}
// @ts-ignore
@connect(mapStateToProps, mapDispatchToProps)
export default class Index extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  subscription?: EmitterSubscription
  bgUpdateTimer?: number
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: true,
      refreshing: false,
      consultationList: [],
      scanUserList: [],
    }
  }
  componentDidMount() {
    this.init()
    this.subscription = DeviceEventEmitter.addListener(pathMap.AdvisoryIndex + "Reload", _ => {
      this.init()
    })
    this.bgUpdateTimer = setInterval(this.bgUpdate, 5000)
  }
  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove()
    }
    if (this.bgUpdateTimer) {
      clearInterval(this.bgUpdateTimer)
    }
  }
  init = async () => {
    this.setState({ hasLoad: false })
    try {
      let isLogin = await api.isLogin()
      if (!isLogin) {
        this.props.navigation.navigate(pathMap.Login)
        return
      }
      Buff.clearNotifications()
      const listConsultationPromise = doctor.listConsultation({ page: -1, limit: -1 })
      const listScanUserPromise = doctor.listScanUser()

      let {
        data: { list: consultationList },
      } = await listConsultationPromise
      let {
        data: { list: scanUserList },
      } = await listScanUserPromise

      for (let consultation of consultationList) {
        if (consultation.doctorUnreadMsgCount !== 0) {
          this.props.setUserUnReadMsgCount({
            uid: consultation.patientUid,
            count: consultation.doctorUnreadMsgCount,
          })
        }
      }
      console.log(scanUserList)
      this.setState({
        hasLoad: true,
        scanUserList,
        consultationList,
      })
    } catch (err) {
      this.setState({
        hasLoad: true,
      })
      Toast.fail("获取咨询列表失败, 错误信息: " + err.msg)
    }
  }
  bgUpdate = async () => {
    try {
      let isLogin = await api.isLogin()
      if (!isLogin) {
        this.props.navigation.navigate(pathMap.Login)
        return
      }
      Buff.clearNotifications()
      const listConsultationPromise = doctor.listConsultation({ page: -1, limit: -1 })
      const listScanUserPromise = doctor.listScanUser()

      let {
        data: { list: consultationList },
      } = await listConsultationPromise
      let {
        data: { list: scanUserList },
      } = await listScanUserPromise

      for (let consultation of consultationList) {
        if (consultation.doctorUnreadMsgCount !== 0) {
          this.props.setUserUnReadMsgCount({
            uid: consultation.patientUid,
            count: consultation.doctorUnreadMsgCount,
          })
        }
      }
      this.setState({
        scanUserList,
        consultationList,
      })
    } catch (err) {
      console.log(err)
    }
  }
  onRefresh = () => {
    this.setState({ refreshing: true })
    this.init()
      .then(() => {
        this.setState({ refreshing: false })
      })
      .catch(err => {
        Toast.fail("刷新失败,错误信息: " + err.msg)
      })
  }
  /**
   * 获取用户最后的一条信息
   */
  getUserWsLastMsg = (uid: number) => {
    if (uid in this.props.ws.chatMsg) {
      let lastMsg = this.props.ws.chatMsg[uid][this.props.ws.chatMsg[uid].length - 1]
      return lastMsg
    }
    return false
  }
  // 获取用户当前的消息信息
  getCurrMsgInfo = (consultation: ConsultationItem): { currMsg: string; currMsgTime: string } => {
    let lastMsg = this.getUserWsLastMsg(consultation.patientUid)
    let currMsg = "",
      currMsgTime = ""
    if (!lastMsg) {
      currMsg = consultation.currMsg
      currMsgTime = consultation.currMsgTime
    } else {
      if (lastMsg.type === MsgType.audio) {
        currMsg = "语音消息"
      } else if (lastMsg.type === MsgType.picture) {
        currMsg = "图片消息"
      } else if (lastMsg.type === MsgType.treatmentPlan) {
        currMsg = "处方消息"
      } else if (lastMsg.type === MsgType.txt) {
        currMsg = lastMsg.msg || ""
      }
      currMsgTime = lastMsg.sendTime
    }
    return {
      currMsg,
      currMsgTime,
    }
  }
  render() {
    if (!this.state.hasLoad) {
      return (
        <View style={style.loading}>
          <View style={style.loadingPic}>
            <Image style={style.loadingImg} source={gImg.common.loading} />
          </View>
        </View>
      )
    }
    let { unReadMsgCountRecord } = this.props.ws
    let consultationOpenIdList = this.state.consultationList.map(v => v.openid)
    return (
      <>
        <ScrollView
          style={style.main}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          <View
            style={[
              style.headerList,
              globalStyle.flex,
              globalStyle.alignItemsCenter,
              globalStyle.justifyContentSpaceBetween,
              { display: "none" },
            ]}>
            <TouchableOpacity
              style={[style.headerItem, globalStyle.flex, globalStyle.alignItemsCenter]}>
              <Image style={style.headerIcon} source={gImg.advisory.reply} />
              <Text style={[style.headerItemTitle, globalStyle.fontSize14, globalStyle.fontStyle]}>
                待回复
              </Text>
            </TouchableOpacity>
            <View style={style.separationLine} />
            <TouchableOpacity
              style={[style.headerItem, globalStyle.flex, globalStyle.alignItemsCenter]}>
              <Image style={style.headerIcon} source={gImg.advisory.pillPurchase} />
              <Text style={[style.headerItemTitle, globalStyle.fontSize14, globalStyle.fontStyle]}>
                代购药
              </Text>
            </TouchableOpacity>
          </View>
          <View style={style.msgList}>
            {this.state.consultationList.map((consultation, k) => {
              let currMsgInfo = this.getCurrMsgInfo(consultation)
              return (
                <TouchableOpacity
                  key={k}
                  style={[
                    style.msgItem,
                    globalStyle.flex,
                    globalStyle.justifyContentSpaceBetween,
                    globalStyle.alignItemsCenter,
                  ]}
                  onPress={() =>
                    this.props.navigation.push(pathMap.AdvisoryChat, {
                      patientUid: consultation.patientUid,
                      patientName: consultation.name,
                      consultationId: consultation.id,
                    })
                  }>
                  <View style={style.baseInformation}>
                    <View style={style.avatarFormat}>
                      <Image
                        style={style.avatar}
                        source={
                          consultation.avatar.url
                            ? { uri: getPicCdnUrl(consultation.avatar.url, "avatar") }
                            : gImg.common.defaultAvatar
                        }
                      />
                    </View>
                    <View
                      style={[
                        style.baseInformationBottom,
                        globalStyle.flex,
                        globalStyle.justifyContentSpaceAround,
                        globalStyle.alignItemsCenter,
                      ]}>
                      <Image
                        style={style.gender}
                        source={
                          consultation.gender === GENDER.MAN
                            ? gImg.common.man
                            : consultation.gender === GENDER.WOMAN
                            ? gImg.common.woman
                            : gImg.common.genderNull
                        }
                      />
                      <Text style={[style.age, globalStyle.fontSize13, globalStyle.fontStyle]}>
                        {consultation.year_age}岁
                        {consultation.month_age !== 0 ? consultation.month_age + "月" : null}
                      </Text>
                    </View>
                  </View>
                  <View style={style.msgCenter}>
                    <View
                      style={[
                        globalStyle.flex,
                        globalStyle.justifyContentSpaceBetween,
                        globalStyle.alignItemsCenter,
                      ]}>
                      <Text
                        style={[style.msgName, globalStyle.fontSize15, globalStyle.fontStyle]}
                        numberOfLines={1}>
                        {consultation.name}
                      </Text>
                      <Text style={[style.msgTime, globalStyle.fontSize13, globalStyle.fontStyle]}>
                        {currMsgInfo.currMsgTime.substr(0, 10)}
                      </Text>
                    </View>
                    <View style={[style.msgDetail, global.flex, global.alignItemsCenter]}>
                      <Text
                        style={[
                          style.msgDescription,
                          globalStyle.fontSize14,
                          globalStyle.fontStyle,
                        ]}
                        numberOfLines={1}>
                        {currMsgInfo.currMsg || "无消息"}
                      </Text>
                      {consultation.isWaitReply && (
                        <Badge dot>
                          <Text style={[style.replay, global.fontSize12]}>待回复</Text>
                        </Badge>
                      )}
                      {consultation.isWaitBuyDrug && (
                        <Badge dot>
                          <Text style={[style.replay, global.fontSize12]}>待购药</Text>
                        </Badge>
                      )}
                      {!consultation.isWaitBuyDrug && !consultation.isWaitBuyDrug && (
                        <Badge>
                          <Text style={[style.replay, global.fontSize12]}>问诊中</Text>
                        </Badge>
                      )}
                      {consultation.patientUid in unReadMsgCountRecord &&
                      unReadMsgCountRecord[consultation.patientUid] > 0 ? (
                        <Badge
                          style={{ marginLeft: 20, marginRight: 20 }}
                          text={unReadMsgCountRecord[consultation.patientUid]}
                        />
                      ) : null}
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })}
            {this.state.consultationList.length === 0 ? <Empty /> : null}
            <View style={{ padding: 10, marginTop: 5 }}>
              <Text style={{ fontSize: 16 }}>微信扫码用户</Text>
            </View>
            <View style={[{ flex: 1 }]}>
              {this.state.scanUserList
                .filter(user => !consultationOpenIdList.includes(user.openid))
                .map(scanUser => {
                  return (
                    <TouchableOpacity
                      key={scanUser.openid}
                      onPress={() => {
                        this.chatWithWxScanUser(scanUser.openid, scanUser.nick)
                      }}>
                      <View
                        style={[
                          style.msgItem,
                          globalStyle.flex,
                          globalStyle.justifyContentSpaceBetween,
                          globalStyle.alignItemsCenter,
                        ]}>
                        <View style={style.baseInformation}>
                          <View style={style.avatarFormat}>
                            <Image
                              style={style.avatar}
                              source={
                                scanUser.avatar
                                  ? { uri: scanUser.avatar }
                                  : gImg.common.defaultAvatar
                              }
                            />
                          </View>
                        </View>
                        <View style={style.msgCenter}>
                          <View
                            style={[
                              globalStyle.flex,
                              globalStyle.justifyContentSpaceBetween,
                              globalStyle.alignItemsCenter,
                            ]}>
                            <Text
                              style={[style.msgName, globalStyle.fontSize15, globalStyle.fontStyle]}
                              numberOfLines={1}>
                              {scanUser.nick}
                            </Text>
                            <Text
                              style={[
                                style.msgTime,
                                globalStyle.fontSize13,
                                globalStyle.fontStyle,
                              ]}>
                              扫码时间: {scanUser.scanTime}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                })}
            </View>
          </View>
        </ScrollView>
      </>
    )
  }
  chatWithWxScanUser = (openid: string, nick: string) => {
    this.props.navigation.push(pathMap.AdvisoryChat, {
      mode: "scanUser",
      openid,
      patientName: nick,
    })
  }
}
