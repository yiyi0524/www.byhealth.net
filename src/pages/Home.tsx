import global from "@/assets/styles/global"
import { BASE_URL } from "@/config/api"
import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import pathMap from "@/routes/pathMap"
import { ALLOW_INQUIRY } from "@/services/doctor"
import { isDebugMode } from "@/utils/utils"
import { Icon, Toast } from "@ant-design/react-native"
import api, { checkUpdate, updateAliPushDeviceId } from "@api/api"
import userApi from "@api/user"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import {
  DeviceEventEmitter,
  EmitterSubscription,
  Image,
  NativeEventSubscription,
  PermissionsAndroid,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from "react-native"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { Picture } from "./advisory/Chat"
import Buff from "@utils/Buff"
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
  isFirstStart: boolean
  refreshing: boolean
  hasLoad: boolean
  hasRealNameAuth: boolean
  prescriptionCount: number
  patientCount: number
  name: string
  avatar: Picture
  bannerList: bannerItem[]
  settingList: SettingItem[]
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
export interface SettingItem {
  name: string
  description: string
  link: string
}
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
  loginStatus?: NativeEventSubscription
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
    this.shortcutList = [
      {
        icon: gImg.home.invite,
        title: "邀请患者",
        link: pathMap.InvitePatients,
      },
      {
        icon: gImg.home.sittingInformation,
        title: "坐诊信息",
        link: pathMap.SittingHospital,
      },
      {
        icon: gImg.home.prescriptionTpl,
        title: "处方模板",
        link: pathMap.PrescriptionTpl,
      },
    ]
  }
  getInitState = (): State => {
    return {
      isFirstStart: true,
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
      settingList: [
        {
          name: "复诊及诊后咨询",
          description: "未开启在线复诊",
          link: pathMap.DiagnosisSettings,
        },
        // 二期
        {
          name: "服务设置",
          description: "",
          link: pathMap.ServiceSettings,
        },
        // {
        //   name: "问诊设置",
        //   description: "",
        //   link: "",
        // },
        // {
        //   name: "欢迎语设置",
        //   description: "",
        //   link: "",
        // },
      ],
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
      this.init()
    })
    // this.loginStatus = BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   this.addEventListenerLoginStatus,
    // )
    this.init()
    // this.readPermission()
    // this.writePermission()
  }
  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove()
    }
    // if (this.loginStatus) {
    //   this.loginStatus.remove()
    // }
  }
  readPermission = () => {
    try {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
        .then(async res => {
          console.log("读取权限" + res)
          if (!res) {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA,
              {
                title: "申请读取权限",
                message: "博一健康要打开您的读取权限,是否允许?",
                buttonNeutral: "稍后询问",
                buttonNegative: "禁止",
                buttonPositive: "允许",
              },
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log("允许打开读取权限")
            } else {
              console.log("禁止打开许读取权限")
            }
          }
        })
        .catch(err => {
          console.log("读取权限失败: " + err)
        })
    } catch (err) {
      console.log(err)
    }
  }
  writePermission = () => {
    try {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
        .then(async res => {
          console.log("写入权限" + res)
          if (!res) {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA,
              {
                title: "申请写入权限",
                message: "博一健康要打开您的写入权限,是否允许?",
                buttonNeutral: "稍后询问",
                buttonNegative: "禁止",
                buttonPositive: "允许",
              },
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log("允许打开写入权限")
            } else {
              console.log("禁止打开许写入权限")
            }
          }
        })
        .catch(err => {
          console.log("读取权限失败: " + err)
        })
    } catch (err) {
      console.log(err)
    }
  }
  addEventListenerLoginStatus = async () => {
    let isLogin = await api.isLogin()
    if (!isLogin) {
      this.props.navigation.navigate(pathMap.Login)
    }
  }
  init = async () => {
    let isLogin = false
    try {
      isLogin = await api.isLogin()
      if (isLogin) {
        Buff.getAliPushDeviceId(1)
          .then((deviceId: string) => {
            updateAliPushDeviceId({ deviceId })
            console.log("阿里云推送设置id = ", deviceId)
          })
          .catch((e: any) => {
            console.log("获取阿里云推送设备id失败,错误信息", e)
          })
        if (!isDebugMode() && this.state.isFirstStart) {
          checkUpdate()
            .then(json => {
              const {
                data: { updateUrl, needUpdate },
              } = json
              if (needUpdate) {
                Alert.alert(
                  "更新提示",
                  "有新的版本 是否更新?",
                  [
                    { text: "取消", style: "cancel" },
                    {
                      text: "确定",
                      onPress: () =>
                        Linking.openURL(updateUrl).catch(err => console.error("打开url 失败", err)),
                    },
                  ],
                  { cancelable: false },
                )
              }
              this.setState({
                isFirstStart: false,
              })
            })
            .catch(e => {
              console.log(e)
              this.setState({
                isFirstStart: false,
              })
            })
        }
        let {
          data: { doctorInfo, info },
        } = await userApi.getPersonalInfo()
        this.props.login({
          uid: info.id,
          avatar: info.avatar,
          name: info.name,
        })
        let { settingList } = this.state
        if ("allowInquiry" in doctorInfo) {
          settingList[0].description =
            doctorInfo.allowInquiry === ALLOW_INQUIRY.FALSE ? "未开启在线复诊" : "已开启在线复诊"
        }
        this.setState({
          name: info.name,
          avatar: info.avatar
            ? info.avatar
            : {
                id: 0,
                title: "",
                url: "",
              },
          hasRealNameAuth: doctorInfo.hasRealNameAuth,
          prescriptionCount: doctorInfo.prescriptionCount,
          patientCount: doctorInfo.patientCount,
          settingList,
        })
      } else {
        this.props.navigation.navigate(pathMap.Login)
      }
    } catch (err) {
      console.log(err)
    }
    this.setState({
      hasLoad: true,
    })
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
            <View style={style.headerAvatarCircle}>
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
                  onPress={() => {
                    this.props.navigation.push(pathMap.RealNameAuth)
                  }}
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
            <TouchableOpacity
              style={style.headerHelp}
              onPress={() => {
                this.props.navigation.push(pathMap.CustomerService)
                // this.props.navigation.push(pathMap.Test)
              }}>
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
              onPress={() => {
                if (!this.state.hasRealNameAuth) {
                  return Toast.info("您未认证完成", 1)
                }
                this.props.navigation.push(pathMap.Prescription)
              }}>
              <Text style={[style.prescriptionItemNum, global.fontSize15]}>
                {this.state.prescriptionCount}
              </Text>
              <Text style={[style.prescriptionItemTitle, global.fontSize12]}>处方数</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => {
                Buff.setShortcutBadger(988)
              }}
            > */}
            <View style={style.prescriptionItem}>
              <Text style={[style.prescriptionItemNum, global.fontSize15]}>
                {this.state.patientCount}
              </Text>
              <Text style={[style.prescriptionItemTitle, global.fontSize12]}>患者数</Text>
            </View>
            {/* </TouchableOpacity> */}
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
                      return Toast.info("您未认证完成", 1)
                    }
                    this.props.navigation.push(item.link)
                  }}>
                  <View style={style.categoryItemPicFa}>
                    <Image style={style.categoryItemPic} source={item.icon} />
                  </View>
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
            {this.state.settingList.map((v, k) => {
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
                      return Toast.info("您未认证完成", 1)
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
