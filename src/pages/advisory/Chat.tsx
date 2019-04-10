import global from "@/assets/styles/global"
import { BASE_URL } from "@/config/api"
import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import pathMap from "@/routes/pathMap"
import userApi, { personalInfo } from "@/services/user"
import wsMsgApi from "@/services/wsMsg"
import gImg from "@/utils/img"
import { TextareaItem, Toast } from "@ant-design/react-native"
import sColor from "@styles/color"
import gStyle from "@utils/style"
import React, { Component, ReactChild } from "react"
import { Image, ImageSourcePropType, PixelRatio, RefreshControl, Text, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { NavigationScreenProp, ScrollView } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { Overwrite } from "utility-types"
const style = gStyle.advisory.advisoryChat
interface Props {
  navigation: NavigationScreenProp<State>
}
/**
 * 枚举类型
 */
export enum MsgType {
  txt,
  picture,
  inquirySheet,
  patientsThemselves,
}
export interface bottomNavItem {
  title: string
  icon: ImageSourcePropType
  link: string
}
export interface Picture {
  id: number
  title: string
  url: string
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
interface State {
  hasLoad: boolean
  refreshing: boolean
  isShowBottomNav: boolean
  isShowBottomPicSelect: boolean
  hasMoreRecord: boolean
  isShowPic: boolean
  showPicUrl: string
  info: personalInfo
  msgId: number
  patientId: number
  page: number
  limit: number
  filter: {}
  msgList: Msg<any>[]
  sendMsg: string
}
const mapStateToProps = (state: AppState) => {
  return {
    isLogin: state.user.isLogin,
    name: state.user.name,
    uid: state.user.uid,
  }
}
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    login: (preload: userAction.UserInfo) => {
      dispatch(userAction.userLogin(preload))
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
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<State> }) => {
    let title = ""
    if (navigation.state.params) {
      title = navigation.state.params.title
    }
    return {
      title,
      headerStyle: {
        backgroundColor: sColor.white,
        height: 45,
        elevation: 0,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: sColor.colorEee,
      },
      headerTintColor: sColor.color333,
      headerTitleStyle: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        textAlign: "center",
      },
      headerRight: (
        <TouchableOpacity
          onPress={() =>
            navigation.push(pathMap.PatientDetail, {
              id: navigation.getParam("patientId"),
            })
          }>
          <Text style={[style.headerRight, global.fontSize14, global.fontStyle]}>病历</Text>
        </TouchableOpacity>
      ),
    }
  }
  bottomNavList: bottomNavItem[] = []
  constructor(props: any) {
    super(props)
    this.bottomNavList = [
      {
        icon: gImg.advisory.dialecticalPrescriptions,
        title: "辩证开方",
        link: pathMap.SquareRoot,
      },
      {
        icon: gImg.advisory.quickReply,
        title: "快捷回复",
        link: "",
      },
      {
        icon: gImg.advisory.closingConversation,
        title: "结束对话",
        link: "",
      },
      {
        icon: gImg.advisory.show,
        title: "更多功能",
        link: "",
      },
      {
        icon: gImg.advisory.inquirySheet,
        title: "补填问诊单",
        link: "",
      },
      {
        icon: gImg.advisory.picture,
        title: "图片",
        link: "",
      },
      {
        icon: gImg.advisory.givingquestions,
        title: "赠送提问",
        link: "",
      },
      {
        icon: gImg.advisory.sittingInformation,
        title: "坐诊信息",
        link: "",
      },
    ]
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      isShowBottomNav: false,
      isShowBottomPicSelect: false,
      hasMoreRecord: false,
      isShowPic: false,
      showPicUrl: "",
      patientId: 0,
      info: {
        id: 0,
        nick: "",
        account: "",
        email: "",
        gender: 0,
        phone: "",
        profile: "",
        avatar: {
          id: 0,
          title: "",
          url: "",
        },
      },
      msgId: 0,
      page: 1,
      limit: 10,
      filter: {},
      msgList: [],
      sendMsg: "",
    }
  }
  async componentDidMount() {
    await this.init()
  }
  init = async () => {
    let msgId = this.props.navigation.getParam("id")
    let patientId = this.props.navigation.getParam("patientId")
    let page = this.state.page,
      limit = this.state.limit,
      filter = this.state.filter
    await userApi
      .getPersonalInfo()
      .then(json => {
        this.setState({
          info: json.data.info,
        })
      })
      .catch(err => {
        console.log(err.msg)
      })
    await this.getMsgList(page, limit, filter)
    this.setState({
      hasLoad: true,
      msgId,
      patientId,
    })
  }
  getMsgList = async (page: number, limit: number, filter = {}) => {
    try {
      let { data } = await wsMsgApi.getMsgList({ page, limit, filter })
      // 格式化
      let oriMsgList: Exclude<Overwrite<Msg, { pic: Picture }>, "dom">[] = data.list
      let formatMsg: Msg | undefined
      let msgList = this.state.msgList,
        newList: Msg<any>[] = []
      for (let serverMsg of oriMsgList) {
        switch (serverMsg.type) {
          case MsgType.txt:
            formatMsg = this.txtFormat(serverMsg)
            break
          case MsgType.picture:
            formatMsg = this.pictureFormat(serverMsg)
            break
        }
        if (formatMsg) {
          newList.push(formatMsg)
        }
      }
      msgList.unshift(...newList)
      this.setState({
        msgList,
        hasMoreRecord: data.count > msgList.length,
      })
    } catch (err) {
      console.log(err)
    }
  }
  txtFormat = (serverMsg: Exclude<Msg, "dom">) => {
    let msg: Msg = serverMsg
    let isSelfMsg = msg.sendUser.uid === this.state.info.id
    msg.dom = (
      <View>
        {/*  左边文字 */}
        <View style={isSelfMsg ? global.hidden : style.item}>
          <Text style={[style.sendTime, global.fontStyle, global.fontSize12]}>
            {msg.sendTime.substr(0, 16)}
          </Text>
          <View style={[style.leftItem, global.flex]}>
            <View style={style.itemPic}>
              <Image
                style={style.itemImg}
                source={
                  msg.sendUser.avatar.url
                    ? { uri: BASE_URL + msg.sendUser.avatar.url }
                    : gImg.common.defaultAvatar
                }
              />
            </View>
            <View style={isSelfMsg ? global.hidden : style.leftItemIcon} />
            <Text style={[style.leftItemTitle, global.fontStyle, global.fontSize14]}>
              {msg.msg}
            </Text>
          </View>
        </View>
        {/* 右边文字 */}
        <View style={isSelfMsg ? style.item : global.hidden}>
          <Text style={[style.sendTime, global.fontStyle, global.fontSize12]}>
            {msg.sendTime.substr(0, 16)}
          </Text>
          <View style={[style.leftItem, global.flex, global.justifyContentEnd]}>
            <Text style={[style.rightItemTitle, global.fontStyle, global.fontSize14]}>
              {msg.msg}
            </Text>
            <View style={isSelfMsg ? style.rightItemIcon : global.hidden} />
            <View style={style.itemPic}>
              <Image
                style={style.itemImg}
                source={
                  msg.sendUser.avatar.url
                    ? { uri: BASE_URL + msg.sendUser.avatar.url }
                    : gImg.common.defaultAvatar
                }
              />
            </View>
          </View>
        </View>
      </View>
    )
    return msg
  }
  pictureFormat = (serverMsg: Exclude<Overwrite<Msg, { pic: Picture }>, "dom">) => {
    let msg: Overwrite<Msg, { pic: Picture }> = serverMsg
    let isSelfMsg = msg.sendUser.uid === this.state.info.id
    msg.dom = (
      <View>
        {/* 左边图片 */}
        <View style={isSelfMsg ? global.hidden : style.item}>
          <Text style={[style.sendTime, global.fontStyle, global.fontSize12]}>
            {msg.sendTime.substr(0, 16)}
          </Text>
          <View style={[style.leftItem, global.flex]}>
            <View style={style.itemPic}>
              <Image
                style={style.itemImg}
                source={
                  msg.sendUser.avatar.url
                    ? { uri: BASE_URL + msg.sendUser.avatar.url }
                    : gImg.common.defaultAvatar
                }
              />
            </View>
            <View style={isSelfMsg ? global.hidden : style.leftItemIcon} />
            <TouchableOpacity
              style={style.leftItemPicture}
              onPress={() => this.openShowPic(BASE_URL + msg.pic.url)}>
              <Image
                style={style.itemPicImg}
                source={msg.pic.url ? { uri: BASE_URL + msg.pic.url } : gImg.common.defaultPic}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* 右边图片 */}
        <View style={isSelfMsg ? style.item : global.hidden}>
          <Text style={[style.sendTime, global.fontStyle, global.fontSize12]}>
            {msg.sendTime.substr(0, 16)}
          </Text>
          <View style={[style.leftItem, global.flex, global.justifyContentEnd]}>
            <TouchableOpacity
              style={style.rightItemPicture}
              onPress={() => this.openShowPic(BASE_URL + msg.pic.url)}>
              <Image
                style={style.itemPicImg}
                source={msg.pic.url ? { uri: BASE_URL + msg.pic.url } : gImg.common.defaultPic}
              />
            </TouchableOpacity>
            <View style={isSelfMsg ? style.rightItemIcon : global.hidden} />
            <View style={style.itemPic}>
              <Image
                style={style.itemImg}
                source={
                  msg.sendUser.avatar.url
                    ? { uri: BASE_URL + msg.sendUser.avatar.url }
                    : gImg.common.defaultAvatar
                }
              />
            </View>
          </View>
        </View>
      </View>
    )
    return msg
  }
  onRefresh = () => {
    this.setState({ refreshing: true })
    new Promise(s =>
      setTimeout(async () => {
        let page = this.state.page + 1,
          limit = this.state.limit,
          filter = this.state.filter
        await this.getMsgList(page, limit, filter)
        s()
      }, 500),
    )
      .then(_ => {
        this.setState({ refreshing: false })
      })
      .catch(err => {
        Toast.fail("刷新失败,错误信息: " + err.msg)
      })
  }
  selectBottomNav = (v: bottomNavItem) => {
    if (v.title === "更多功能") {
      this.setState({
        isShowBottomNav: true,
      })
      v.title = "收起"
      v.icon = gImg.advisory.retract
    } else if (v.title === "收起") {
      this.setState({
        isShowBottomNav: false,
      })
      v.title = "更多功能"
      v.icon = gImg.advisory.show
    } else if (v.title === "图片") {
      this.setState({
        isShowBottomPicSelect: !this.state.isShowBottomPicSelect,
      })
    } else {
      this.props.navigation.push(v.link, { patientId: this.state.patientId })
    }
  }
  sendMsg = () => {
    if (this.state.sendMsg === "") {
      return
    }
    Toast.info(this.state.sendMsg, 1)
    setTimeout(() => {
      this.setState({
        sendMsg: "",
      })
    }, 1000)
  }
  openShowPic = (url: string) => {
    this.setState({
      isShowPic: true,
      showPicUrl: url,
    })
  }
  closeShowPic = () => {
    this.setState({
      isShowPic: false,
      showPicUrl: "",
    })
  }
  render() {
    if (!this.state.hasLoad) {
      return (
        <View style={style.loading}>
          <View style={style.loadingPic}>
            <Image style={style.loadingImg} source={gImg.common.loading} />
          </View>
          <Text style={[style.loadingTitle, global.fontSize14, global.fontStyle]}>加载中...</Text>
        </View>
      )
    }
    return (
      <>
        <View style={style.main}>
          <ScrollView
            style={style.content}
            refreshControl={
              <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
            }>
            <View style={style.list}>
              <Text
                style={[
                  this.state.hasMoreRecord ? style.downloadMore : global.hidden,
                  global.fontStyle,
                  global.fontSize12,
                ]}>
                下拉查看更多聊天记录
              </Text>
              {this.state.msgList.map((v: Msg, k: number) => {
                return <View key={k}>{v.dom}</View>
              })}
            </View>
          </ScrollView>
          <View style={style.bottom}>
            <View style={style.bottomNav}>
              <View
                style={[
                  this.state.isShowBottomNav ? style.bottomNavListActive : style.bottomNavList,
                  global.flex,
                  global.alignItemsCenter,
                  global.flexWrap,
                ]}>
                {this.bottomNavList.map((v: bottomNavItem, k: number) => {
                  return (
                    <TouchableOpacity
                      onPress={() => this.selectBottomNav(v)}
                      key={k}
                      style={style.bottomNavItem}>
                      <Image style={style.bottomNavItemPic} source={v.icon} />
                      <Text style={[style.bottomNavItemTitle, global.fontSize13, global.fontStyle]}>
                        {v.title}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
              <View style={style.bottomInputFa}>
                <View
                  style={[
                    style.bottomInput,
                    global.flex,
                    global.justifyContentSpaceBetween,
                    global.alignItemsCenter,
                  ]}>
                  <TouchableOpacity>
                    {/* <Image
                      style={style.bottomInputImg}
                      source={gImg.advisory.voice}
                    /> */}
                  </TouchableOpacity>
                  <View style={style.inputFa}>
                    <TextareaItem
                      style={style.input}
                      placeholder="请输入"
                      autoHeight
                      clear
                      last
                      rows={1}
                      value={this.state.sendMsg}
                      onChange={value => {
                        this.setState({
                          sendMsg: value as string,
                        })
                      }}
                    />
                  </View>
                  <TouchableOpacity onPress={this.sendMsg}>
                    <Text style={[style.bottomInputSendBtn, global.fontSize14, global.fontStyle]}>
                      发送
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    this.state.isShowBottomPicSelect ? style.selectPicActive : style.selectPic,
                    global.flex,
                    global.alignItemsCenter,
                    global.justifyContentSpaceAround,
                  ]}>
                  <TouchableOpacity style={style.selectPicFa}>
                    <Image source={gImg.advisory.selectPic} style={style.selectImg} />
                    <Text style={[style.selectTitle, global.fontSize14, global.fontStyle]}>
                      图片
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={style.selectPicFa}>
                    <Image source={gImg.advisory.selectPhoto} style={style.selectImg} />
                    <Text style={[style.selectTitle, global.fontSize14, global.fontStyle]}>
                      拍照
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* 图片查看器 */}
        <View style={this.state.isShowPic ? style.showPic : global.hidden}>
          <TouchableOpacity onPress={this.closeShowPic} activeOpacity={0.8}>
            <View style={style.howImgFa}>
              <Image
                style={style.showImg}
                source={
                  this.state.showPicUrl
                    ? {
                        uri: this.state.showPicUrl,
                      }
                    : gImg.common.defaultPic
                }
              />
            </View>
          </TouchableOpacity>
        </View>
      </>
    )
  }
}
