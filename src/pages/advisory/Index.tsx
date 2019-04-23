import { AppState } from "@/redux/stores/store"
import pathMap from "@/routes/pathMap"
import doctor, { GENDER } from "@/services/doctor"
import { getPicFullUrl } from "@/utils/utils"
import { Toast } from "@ant-design/react-native"
import Empty from "@components/Empty"
import * as wsAction from "@redux/actions/ws"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { NavigationScreenProp } from "react-navigation"
import { Dispatch } from "redux"
import { Picture } from "./Chat"
import { connect } from "react-redux"

const style = gStyle.advisory.advisoryIndex
const globalStyle = gStyle.global

export interface ConsultationItem {
  id: number
  gender: number
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
  }
}
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class Index extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: true,
      refreshing: false,
      consultationList: [],
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    this.setState({ hasLoad: false })
    let {
      data: { list: consultationList },
    } = await doctor.listConsultation({ page: -1, limit: -1 })
    this.setState({
      hasLoad: true,
      consultationList,
    })
  }
  onRefresh = () => {
    this.setState({ refreshing: true })
    Promise.all([this.init(), new Promise(s => setTimeout(s, 500))])
      .then(_ => {
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
    let currMsg, currMsgTime
    if (!lastMsg) {
      currMsg = consultation.currMsg
      currMsgTime = consultation.currMsgTime
    } else {
      currMsg = lastMsg.msg || ""
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
                    })
                  }>
                  <View style={style.baseInformation}>
                    <View style={style.avatarFormat}>
                      <Image
                        style={style.avatar}
                        source={
                          consultation.avatar.url
                            ? { uri: getPicFullUrl(consultation.avatar.url) }
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
                    <Text
                      style={[style.msgDescription, globalStyle.fontSize14, globalStyle.fontStyle]}
                      numberOfLines={1}>
                      {currMsgInfo.currMsg || "无消息"}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            })}
            {this.state.consultationList.length === 0 ? <Empty /> : null}
          </View>
        </ScrollView>
      </>
    )
  }
}
