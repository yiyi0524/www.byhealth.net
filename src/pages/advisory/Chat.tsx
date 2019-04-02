import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import wsMsgApi from "@/services/wsMsg"
import { Toast, InputItem } from "@ant-design/react-native"
import sColor from "@styles/color"
import gStyle from "@utils/style"
import React, { Component, ReactChild } from "react"
import {
  PixelRatio,
  RefreshControl,
  Text,
  View,
  Image,
  ImageSourcePropType,
} from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { NavigationScreenProp, ScrollView } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import global from "@/assets/styles/global"
import pathMap from "@/routes/pathMap"
import gImg from "@/utils/img"
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
  click?: Promise<void>
  isShowMore?: boolean
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
  msgId: number
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
  Props &
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = ({
    navigation,
  }: {
    navigation: NavigationScreenProp<State>
  }) => {
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
          }
        >
          <Text
            style={[style.headerRight, global.fontSize14, global.fontStyle]}
          >
            病历
          </Text>
        </TouchableOpacity>
      ),
    }
  }
  bottomNavList: bottomNavItem[] = []
  constructor(props: any) {
    super(props)
    this.bottomNavList = [
      {
        icon: gImg.advisory.followUp,
        title: "辩证开方",
        link: "",
      },
      {
        icon: gImg.advisory.followUp,
        title: "快捷回复",
        link: "",
      },
      {
        icon: gImg.advisory.followUp,
        title: "结束对话",
        link: "",
      },
      {
        icon: gImg.advisory.followUp,
        title: "张开",
        link: "",
        isShowMore: false,
      },
      {
        icon: gImg.advisory.followUp,
        title: "补填问诊单",
        link: "",
      },
      {
        icon: gImg.advisory.followUp,
        title: "图片",
        link: "",
      },
      {
        icon: gImg.advisory.followUp,
        title: "赠送提问",
        link: "",
      },
      {
        icon: gImg.advisory.followUp,
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
    let page = this.state.page,
      limit = this.state.limit,
      filter = this.state.filter
    await this.getPageData(page, limit, filter)
    this.setState({
      hasLoad: true,
      msgId,
    })
  }
  getPageData = async (page: number, limit: number, filter = {}) => {
    try {
      let { data } = await wsMsgApi.getMsgList({ page, limit, filter })
      console.log(data)
    } catch (err) {
      console.log(err)
    }
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
  render() {
    if (!this.state.hasLoad) {
      return (
        <View style={style.loading}>
          <Text
            style={[style.loadingTitle, global.fontSize14, global.fontStyle]}
          >
            加载中...
          </Text>
        </View>
      )
    }
    return (
      <>
        <View style={style.main}>
          <ScrollView
            style={style.content}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
          >
            <View style={style.list}>
              {/* 文字左边 */}
              <View style={style.item}>
                <Text
                  style={[style.sendTime, global.fontStyle, global.fontSize12]}
                >
                  2019-02-23 10:00
                </Text>
                <View style={[style.leftItem, global.flex]}>
                  <View style={style.itemPic}>
                    <Image
                      style={style.itemImg}
                      source={gImg.common.defaultAvatar}
                    />
                  </View>
                  <View style={style.leftItemIcon} />
                  <Text
                    style={[
                      style.leftItemTitle,
                      global.fontStyle,
                      global.fontSize14,
                    ]}
                  >
                    发了酸辣粉阿发
                  </Text>
                </View>
              </View>
              {/* 文字右边 */}
              <View style={style.item}>
                <Text
                  style={[style.sendTime, global.fontStyle, global.fontSize12]}
                >
                  2019-02-23 10:00
                </Text>
                <View
                  style={[
                    style.leftItem,
                    global.flex,
                    global.justifyContentEnd,
                  ]}
                >
                  <Text
                    style={[
                      style.rightItemTitle,
                      global.fontStyle,
                      global.fontSize14,
                    ]}
                  >
                    发了酸辣粉阿发
                  </Text>
                  <View style={style.rightItemIcon} />
                  <View style={style.itemPic}>
                    <Image
                      style={style.itemImg}
                      source={gImg.common.defaultAvatar}
                    />
                  </View>
                </View>
              </View>
              {/* 图片左边 */}
              <View style={style.item}>
                <Text
                  style={[style.sendTime, global.fontStyle, global.fontSize12]}
                >
                  2019-02-23 10:00
                </Text>
                <View style={[style.leftItem, global.flex]}>
                  <View style={style.itemPic}>
                    <Image
                      style={style.itemImg}
                      source={gImg.common.defaultAvatar}
                    />
                  </View>
                  <View style={style.leftItemIcon} />
                  <View style={style.leftItemPicture}>
                    <Image
                      style={style.itemPicImg}
                      source={gImg.common.defaultPic}
                    />
                  </View>
                </View>
              </View>
              {/* 图片右边 */}
              <View style={style.item}>
                <Text
                  style={[style.sendTime, global.fontStyle, global.fontSize12]}
                >
                  2019-02-23 10:00
                </Text>
                <View
                  style={[
                    style.leftItem,
                    global.flex,
                    global.justifyContentEnd,
                  ]}
                >
                  <View style={style.rightItemPicture}>
                    <Image
                      style={style.itemPicImg}
                      source={gImg.common.defaultPic}
                    />
                  </View>
                  <View style={style.rightItemIcon} />
                  <View style={style.itemPic}>
                    <Image
                      style={style.itemImg}
                      source={gImg.common.defaultAvatar}
                    />
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={style.bottom}>
            <View
              style={[
                style.bottomNavList,
                global.flex,
                global.alignItemsCenter,
                global.flexWrap,
              ]}
            >
              {this.bottomNavList.map((v: bottomNavItem, k: number) => {
                return (
                  <TouchableOpacity
                    key={k}
                    style={style.bottomNavItem}
                    onPress={() => {}}
                  >
                    <Image style={style.bottomNavItemPic} source={v.icon} />
                    <Text
                      style={[
                        style.bottomNavItemTitle,
                        global.fontSize14,
                        global.fontStyle,
                      ]}
                    >
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
                ]}
              >
                <Image
                  style={style.bottomInputImg}
                  source={gImg.advisory.pillPurchase}
                />
                <View style={style.bottomInputFa}>
                  <InputItem
                    style={style.input}
                    clear
                    value={this.state.sendMsg}
                    onChange={value => {
                      this.setState({
                        sendMsg: value,
                      })
                    }}
                    placeholder="请输入"
                  />
                </View>
                <TouchableOpacity>
                  <Text
                    style={[
                      style.bottomInputSendBtn,
                      global.fontSize14,
                      global.fontStyle,
                    ]}
                  >
                    发送
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </>
    )
  }
}
