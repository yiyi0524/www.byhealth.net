import global from "@/assets/styles/global"
import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import pathMap from "@/routes/pathMap"
import { Icon, Toast } from "@ant-design/react-native"
import api from "@api/api"
import userApi from "@api/user"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  DeviceEventEmitter,
  EmitterSubscription,
} from "react-native"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { Picture } from "./advisory/Chat"
import { BASE_URL } from "@/config/api"
const style = gStyle.home
const globalStyle = gStyle.global
interface Props {
  navigation: NavigationScreenProp<State>
}
interface bannerItem {
  id: number
  url: string
  link: string
}
interface State {
  refreshing: boolean
  hasLoad: boolean
  hasRealNameAuth: boolean
  avatar: Picture
  name: string
  bannerList: bannerItem[]
  prescriptionCount: number
  patientCount: number
}
export interface ShortcutItem {
  icon: any
  title: string
  link: any
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
const settingList = [
  {
    name: "复诊及诊后咨询",
    description: "未开启在线复诊",
    link: pathMap.DiagnosisSettings,
  },
  // {
  //   name: "处方及服务配置",
  //   description: "",
  //   link: "",
  // },
  //todo 二期
  // {
  //   name: "自定义问诊单设置",
  //   description: "已开启自动发送",
  //   link: ""
  // },
  // {
  //   name: "欢迎语设置",
  //   description: "已开启自动发送",
  //   link: ""
  // }
]
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class Home extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  shortcutList: ShortcutItem[] = []
  subscription?: EmitterSubscription
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
    this.shortcutList = [
      {
        icon: gImg.home.invite,
        title: "邀请患者",
        link: pathMap.InvitePatients,
      },
    ]
  }
  getInitState = (): State => {
    return {
      refreshing: false,
      hasLoad: false,
      hasRealNameAuth: false,
      prescriptionCount: 0,
      patientCount: 0,
      avatar: {
        id: 0,
        title: "",
        url: "",
      },
      name: "",
      bannerList: [
        {
          id: 1,
          url: gImg.home.banner_0,
          link: "",
        },
        {
          id: 2,
          url: gImg.home.banner_1,
          link: "",
        },
        {
          id: 3,
          url: gImg.home.banner_2,
          link: "",
        },
        {
          id: 4,
          url: gImg.home.banner_3,
          link: "",
        },
      ],
    }
  }
  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener(pathMap.Home + "Reload", _ => {
      console.log("首页被刷新")
      this.init()
    })
    this.init()
  }
  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove()
    }
  }
  init = async () => {
    let isLogin = false
    try {
      isLogin = await api.isLogin()
      if (isLogin) {
        let {
          data: { doctorInfo, info },
        } = await userApi.getPersonalInfo()
        this.setState({
          name: info.name,
          avatar: info.avatar,
          hasRealNameAuth: doctorInfo.hasRealNameAuth,
          prescriptionCount: doctorInfo.prescriptionCount,
          patientCount: doctorInfo.patientCount,
        })
      }
    } catch (err) {
      console.log(err)
    }
    this.setState({
      hasLoad: true,
    })
    if (!isLogin) {
      this.props.navigation.navigate(pathMap.Login)
    }
  }
  onRefresh = () => {
    this.setState({ refreshing: true })
    Promise.all([this.init(), new Promise(s => setTimeout(s, 170))])
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
          {/* 头部 */}
          <View
            style={[
              style.header,
              globalStyle.flex,
              globalStyle.justifyContentSpaceBetween,
              globalStyle.alignItemsCenter,
            ]}>
            <View
              style={[style.headerAvatarCircle, globalStyle.flex, globalStyle.alignItemsCenter]}>
              <Image
                source={
                  this.state.avatar.url !== ""
                    ? { uri: BASE_URL + this.state.avatar.url }
                    : gImg.common.defaultAvatar
                }
                style={style.headerAvatar}
              />
            </View>
            <View style={style.headerTitle}>
              <Text
                style={[style.headerName, globalStyle.fontSize16, globalStyle.fontStyle]}
                numberOfLines={1}>
                {this.state.name === "" ? "未知" : this.state.name}
                的医馆
              </Text>
              <View style={[style.headerVerified, globalStyle.flex, globalStyle.alignItemsCenter]}>
                <Text
                  style={[
                    style.headerVerifiedTitle,
                    globalStyle.fontStyle,
                    globalStyle.fontSize12,
                  ]}>
                  {" "}
                  医疗资质{this.state.hasRealNameAuth ? "已认证" : "未认证"}{" "}
                </Text>
                <TouchableOpacity
                  style={[
                    this.state.hasRealNameAuth
                      ? globalStyle.hidden
                      : style.headerMedicalQualification,
                    globalStyle.flex,
                    globalStyle.alignItemsCenter,
                  ]}>
                  <Text
                    style={[
                      style.headerMedicalQualificationTitle,
                      globalStyle.fontStyle,
                      globalStyle.fontSize12,
                    ]}>
                    {" "}
                    去认证{" "}
                  </Text>
                  <Icon
                    name="right"
                    style={[style.headerMedicalQualificationIcon, globalStyle.fontSize12]}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={style.headerHelp}>
              <Text style={[globalStyle.fontSize14, globalStyle.fontStyle, style.headerHelpTitle]}>
                帮助
              </Text>
            </TouchableOpacity>
          </View>

          {/* 处方数 */}
          <View
            style={[
              style.prescription,
              global.flex,
              global.alignItemsCenter,
              global.justifyContentSpaceBetween,
            ]}>
            <TouchableOpacity
              style={style.prescriptionItem}
              onPress={() => this.props.navigation.push(pathMap.Prescription)}>
              <Text style={[style.prescriptionItemNum, global.fontSize15]}>
                {this.state.prescriptionCount}
              </Text>
              <Text style={[style.prescriptionItemTitle, global.fontSize12]}>处方数</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.prescriptionItem}>
              <Text style={[style.prescriptionItemNum, global.fontSize15]}>
                {this.state.patientCount}
              </Text>
              <Text style={[style.prescriptionItemTitle, global.fontSize12]}>患者数</Text>
            </TouchableOpacity>
          </View>

          {/* 认证 */}
          <TouchableOpacity
            style={[
              this.state.hasRealNameAuth ? globalStyle.hidden : style.verified,
              globalStyle.flex,
              globalStyle.alignItemsCenter,
              globalStyle.justifyContentSpaceBetween,
            ]}
            onPress={() => {
              this.props.navigation.push(pathMap.RealNameAuth)
            }}>
            <View style={[style.verifiedTheme, globalStyle.flex, globalStyle.alignItemsCenter]}>
              <Text style={[style.verifiedTitle, globalStyle.fontStyle, globalStyle.fontSize12]}>
                认证
              </Text>
              <Text
                style={[style.verifiedDescription, globalStyle.fontStyle, globalStyle.fontSize12]}>
                您还未认证, 点此认证
              </Text>
            </View>
            <Icon name="right" style={[style.verifiedIcon, globalStyle.fontSize14]} />
          </TouchableOpacity>
          {/* 分类 */}
          <View style={style.marginHeight} />
          <View style={[style.categoryList, globalStyle.flex, globalStyle.flexWrap]}>
            {this.shortcutList.map((item: any, k: any) => {
              return (
                <TouchableOpacity
                  key={k}
                  style={style.categoryItem}
                  onPress={() => {
                    if (!this.state.hasRealNameAuth) {
                      return Toast.info("您未认证", 3)
                    }
                    this.props.navigation.push(item.link)
                  }}>
                  <Image style={style.categoryItemPic} source={item.icon} />
                  <Text style={[style.categoryItemTitle, globalStyle.fontSize14]}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
          {/* banner */}
          <ScrollView
            horizontal={true}
            style={[style.bannerList, globalStyle.flex]}
            showsHorizontalScrollIndicator={false}>
            {this.state.bannerList.map((v: any, k: number) => {
              return (
                <TouchableOpacity
                  key={k}
                  style={style.bannerItem}
                  activeOpacity={0.8}
                  onPress={() => console.log(v.link)}>
                  <Image style={style.bannerImg} source={v.url} />
                </TouchableOpacity>
              )
            })}
            <View style={style.scrollPaddingRight} />
          </ScrollView>
          {/* 设置列表 */}
          <View style={style.settingList}>
            {settingList.map((v: any, k: number) => {
              return (
                <TouchableOpacity
                  key={k}
                  style={[
                    style.settingItem,
                    globalStyle.flex,
                    globalStyle.justifyContentSpaceBetween,
                    globalStyle.alignItemsCenter,
                  ]}
                  onPress={() => {
                    if (!this.state.hasRealNameAuth) {
                      return Toast.info("您未认证", 3)
                    }
                    this.props.navigation.push(v.link)
                  }}>
                  <Text
                    style={[style.settingTitle, globalStyle.fontSize15, globalStyle.fontStyle]}
                    numberOfLines={1}>
                    {v.name}
                  </Text>
                  <View style={[globalStyle.flex, globalStyle.alignItemsCenter]}>
                    <Text
                      style={[
                        style.settingDescription,
                        globalStyle.fontSize15,
                        globalStyle.fontStyle,
                      ]}>
                      {v.description}
                    </Text>
                    <Icon name="right" style={[style.settingIcon, globalStyle.fontSize14]} />
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </ScrollView>
      </>
    )
  }
}
