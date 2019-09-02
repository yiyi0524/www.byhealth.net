import global from "@/assets/styles/global"
import DashLine from "@/components/DashLine"
import { BASE_URL } from "@/config/api"
import * as wsAction from "@/redux/actions/ws"
import { AppState } from "@/redux/stores/store"
import pathMap from "@/routes/pathMap"
import api, { getRegion, getThumbUrl, uploadAudio, uploadImg, windowHeight } from "@/services/api"
import { clearPatientUnreadMsgCount, closeInquiry, GENDER_ZH } from "@/services/doctor"
import gImg from "@/utils/img"
import { getPicCdnUrl, getPicFullUrl, windowWidth, getFileCdnUrl } from "@/utils/utils"
import { Icon, ImagePicker, Modal, Portal, TextareaItem, Toast } from "@ant-design/react-native"
import userApi from "@api/user"
import wsMsgApi from "@api/wsMsg"
import imgPickerOpt from "@config/imgPickerOpt"
import { Msg } from "@pages/Ws"
import sColor from "@styles/color"
import Buff from "@utils/Buff"
import gStyle from "@utils/style"
import React, { Component } from "react"
import Sound from "react-native-sound"
import {
  AppState as RnAppState,
  AppStateStatus,
  DeviceEventEmitter,
  EmitterSubscription,
  Image,
  ImageSourcePropType,
  KeyboardAvoidingView,
  PermissionsAndroid,
  PixelRatio,
  Platform,
  RefreshControl,
  Text,
  View,
} from "react-native"
import { AudioRecorder, AudioUtils } from "react-native-audio"
import { TouchableOpacity } from "react-native-gesture-handler"
import RnImagePicker from "react-native-image-picker"
import ImageViewer from "react-native-image-zoom-viewer"
import Permissions from "react-native-permissions"
import { NavigationScreenProp, ScrollView } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { Overwrite } from "utility-types"
const style = gStyle.advisory.advisoryChat
const audioPath = AudioUtils.CachesDirectoryPath + "/tempAudio.aac"
export type ChatMode = "text" | "audio"
interface Props {
  navigation: NavigationScreenProp<State>
}

/**
 * 枚举类型
 */
export enum MsgType {
  txt,
  picture,
  inquirySheet, //问诊单
  patientsThemselves, //患者信息
  treatmentPlan, //治疗方案
  pong,
  audio,
}
export interface bottomNavItem {
  title: string
  icon: ImageSourcePropType
  link: string
}
export interface Region {
  cid: string
  value: string
  label: string
  areaName: string
  level: number
  children: Region[]
}
export interface Picture {
  id: number
  picId?: number
  title: string
  url: string
}
export interface File {
  id: number
  fileId?: number
  title: string
  url: string
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
export interface PatientsThemselves {
  patient: {
    id: number
    name: string
    gender: number
    yearAge: number
    monthAge: number
    weight: number
    height: number
    provinceCid: string
    state: string //用户情况 症状和病情
    allergyHistory: string //病史
    medicalHistory: string //病史
    medicalRecordPics: Picture[] //病历
    tongueCoatingPics: Picture[] //舌苔照
  }
}
interface State {
  // 当前播放的音频的id
  currAudioMsgId: number
  isPalyAudio: boolean
  // 是否有录音权限
  hasMicAuth: boolean
  // 是否正在录音
  isRecord: boolean
  // 录音时长
  recordTime: number
  // 聊天模式
  chatMode: ChatMode
  // 是否刚刚在后台
  lastIsInBackground: boolean
  shouldScrollToEnd: boolean
  hasLoad: boolean
  refreshing: boolean
  isShowBottomNav: boolean
  isShowBottomPicSelect: boolean
  hasMoreRecord: boolean
  isShowPic: boolean
  showPicUrl: string
  patientUid: number
  scrollHeight: number
  page: number
  limit: number
  sendMsg: string
  info: {
    id: number
    account: string
    name: string
    gender: number
    phone: string
    email: string
    avatar: Picture
    profile: string
  }
  region: Region[]
  imagesViewer: imagesViewer[]
  imageIdx: number
  selectPic: Picture[]
}
export interface imagesViewer {
  url: string
  width?: number
  height?: number
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
    addMsgList: (preload: wsAction.MsgListPreload) => {
      dispatch(wsAction.addList(preload))
    },
    addMsg: (preload: wsAction.MsgPreload) => {
      dispatch(wsAction.addMsg(preload))
    },
    setUserUnReadMsgCount: (preload: { uid: number; count: number }) => {
      dispatch(wsAction.setUserUnReadMsgCount(preload))
    },
    setCurrChatUid: (patientUid: number) => {
      dispatch(wsAction.setCurrChatUid({ uid: patientUid }))
    },
  }
}
// @ts-ignore
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class Chat extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<State> }) => {
    let title = ""
    if (navigation.state.params) {
      title = navigation.state.params.patientName
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
          onPress={() => {
            navigation.push(pathMap.AdvisoryMedicalRecord, {
              patientUid: navigation.getParam("patientUid"),
              consultationId: navigation.getParam("consultationId"),
            })
          }}>
          <Text style={[style.headerRight, global.fontSize14, global.fontStyle]}>病历</Text>
        </TouchableOpacity>
      ),
    }
  }
  bottomNavList: bottomNavItem[] = [
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
    // {
    //   icon: gImg.advisory.inquirySheet,
    //   title: "补填问诊单",
    //   link: "",
    // },
    {
      icon: gImg.advisory.picture,
      title: "图片",
      link: "",
    },
    // {
    //   icon: gImg.advisory.givingquestions,
    //   title: "赠送提问",
    //   link: "",
    // },
    // {
    //   icon: gImg.advisory.sittingInformation,
    //   title: "坐诊信息",
    //   link: "",
    // },
  ]
  myScroll: ScrollView | null = null
  msgInput: TextareaItem | null = null
  listener?: EmitterSubscription
  whoosh: Sound | null = null
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    let patientUid = this.props.navigation.getParam("patientUid")
    return {
      currAudioMsgId: 0,
      isPalyAudio: false,
      hasMicAuth: false,
      isRecord: false,
      recordTime: 0,
      chatMode: "text",
      lastIsInBackground: false,
      shouldScrollToEnd: true,
      hasLoad: false,
      refreshing: false,
      isShowBottomNav: false,
      isShowBottomPicSelect: false,
      hasMoreRecord: false,
      isShowPic: false,
      patientUid,
      scrollHeight: 0,
      showPicUrl: "",
      info: {
        id: 0,
        name: "",
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
      page: 1,
      limit: 10,
      sendMsg: "",
      region: [],
      imagesViewer: [
        {
          url: "https://www.byhealth.net/static/media/collapsed_logo.db8ef9b3.png",
          width: windowWidth,
          height: windowHeight,
        },
      ],
      imageIdx: 0,
      selectPic: [],
    }
  }
  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener(pathMap.SquareRoot + "Reload", quickReplyMsg => {
      this.setState({
        sendMsg: quickReplyMsg,
      })
    })
    this.init()
    this.requestReadExteralStorage()
    setTimeout(() => this.myScroll && this.myScroll.scrollToEnd(), 100)
    RnAppState.addEventListener("change", this.onAppStateChange)
    Permissions.check("microphone").then(resp => {
      if (resp === "authorized") {
        this.setState({
          hasMicAuth: true,
        })
      }
    })
    AudioRecorder.onProgress = data => {
      this.setState({ recordTime: Math.floor(data.currentTime) })
    }
    AudioRecorder.onFinished = data => {
      console.log("onFinished: ", data)
    }
  }
  checkAudioRecordAuth = () => {
    return new Promise((s, j) => {
      Permissions.check("microphone")
        .then(resp => {
          // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
          if (resp !== "authorized") {
            Permissions.request("microphone").then(status => {
              if (status === "authorized") {
                s()
              } else {
                j()
              }
            })
          } else {
            s()
          }
        })
        .catch(() => {
          j()
        })
    })
      .then(() => {
        this.setState({ hasMicAuth: true })
      })
      .catch(() => this.setState({ hasMicAuth: false }))
  }
  cancelRecord = () => {
    this.setState({
      isRecord: false,
    })
    AudioRecorder.stopRecording().catch(err => {
      console.log("取消录音失败,", err)
    })
  }
  componentWillUnmount() {
    //移除监听
    if (this.listener) {
      this.listener.remove()
    }
    RnAppState.removeEventListener("change", this.onAppStateChange)
  }
  onAppStateChange = (status: AppStateStatus) => {
    if (status === "background") {
      this.setState({
        lastIsInBackground: true,
      })
    } else if (status === "active") {
      if (this.state.lastIsInBackground) {
        this.setState({
          lastIsInBackground: false,
        })
        let { patientUid } = this.state
        //当医生进入聊天页面则清除未读消息数量
        clearPatientUnreadMsgCount({ patientUid })
        Buff.clearNotifications()
        this.props.setCurrChatUid(patientUid)
        this.props.setUserUnReadMsgCount({ uid: patientUid, count: 0 })

        if (patientUid in this.props.ws.chatMsg) {
          if (this.props.ws.chatMsg[this.state.patientUid].length === 0) {
            this.getMoreMsgList()
            this.setState({
              shouldScrollToEnd: true,
            })
          } else {
            this.updateMsgList()
          }
        } else {
          this.getMoreMsgList()
          this.setState({
            shouldScrollToEnd: true,
          })
        }
        setTimeout(() => this.myScroll && this.myScroll.scrollToEnd(), 100)
      }
    }
  }
  init = async () => {
    userApi
      .getPersonalInfo()
      .then(json => {
        this.setState({
          info: json.data.info,
        })
      })
      .catch(err => {
        console.log(err.msg)
      })
    getRegion()
      .then(json => {
        this.setState({
          region: json.data.region,
        })
      })
      .catch(err => {
        console.log(err.msg)
      })
    this.setState({
      hasLoad: true,
    })
    let { patientUid } = this.state
    //当医生进入聊天页面则清除未读消息数量
    clearPatientUnreadMsgCount({ patientUid })
    Buff.clearNotifications()
    this.props.setCurrChatUid(patientUid)
    this.props.setUserUnReadMsgCount({ uid: patientUid, count: 0 })

    if (patientUid in this.props.ws.chatMsg) {
      if (this.props.ws.chatMsg[this.state.patientUid].length === 0) {
        this.getMoreMsgList()
        this.setState({
          shouldScrollToEnd: true,
        })
      } else {
        this.updateMsgList()
      }
    } else {
      this.getMoreMsgList()
      this.setState({
        shouldScrollToEnd: true,
      })
    }
  }
  onRecordPressIn = () => {
    const { hasMicAuth, isRecord } = this.state
    if (!hasMicAuth) {
      console.log("当前没有录音权限")
      this.checkAudioRecordAuth()
      return
    }
    if (isRecord) {
      console.log("当前正在录音,取消")
      return
    }
    this.setState(
      {
        isRecord: true,
      },
      () => {
        console.log("正在录音")
        AudioRecorder.prepareRecordingAtPath(audioPath, {
          SampleRate: 22050,
          Channels: 1,
          AudioQuality: "Low",
          AudioEncoding: "aac",
        }).then(() => {
          AudioRecorder.startRecording()
            .then(val => console.log("开始录音成功,", val))
            .catch(err => {
              console.error(err)
              this.setState({ isRecord: false })
            })
        })
      },
    )
  }
  onRecordPressOut = () => {
    const { isRecord, patientUid } = this.state
    if (!isRecord) {
      return
    }
    const { recordTime } = this.state
    if (recordTime < 1) {
      console.log("录音时间过短正在取消")
      this.cancelRecord()
      return
    }
    this.setState({
      isRecord: false,
    })
    AudioRecorder.stopRecording().then(val => {
      console.log(val)
      this.setState({
        recordTime: 0,
      })
      let filePrefix = Platform.OS === "android" ? "file://" : ""
      uploadAudio(filePrefix + val)
        .then(json => {
          console.log(json)
          const {
            data: { fileId, url },
          } = json
          this.props.ws.wsPost({
            url: "/ws/sendMsg",
            data: {
              file: {
                url,
                fileId,
              },
              type: MsgType.audio,
              patientUid,
            },
          })
        })
        .catch(err => console.log(err))
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
    const { chatMode, isRecord, recordTime } = this.state
    return (
      <KeyboardAvoidingView
        enabled={Platform.OS !== "android"}
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={90}>
        <View style={style.main}>
          <ScrollView
            ref={ref => (this.myScroll = ref)}
            style={style.content}
            onContentSizeChange={() => {
              if (this.myScroll && this.state.shouldScrollToEnd) {
                this.myScroll.scrollToEnd()
                this.setState({
                  shouldScrollToEnd: false,
                })
              }
            }}
            refreshControl={
              <RefreshControl refreshing={this.state.refreshing} onRefresh={this.getMoreMsgList} />
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
              {Array.isArray(this.props.ws.chatMsg[this.state.patientUid]) &&
                this.props.ws.chatMsg[this.state.patientUid].map((v: any, k) => {
                  let formatMsg: Msg | null = null
                  switch (v.type) {
                    case MsgType.txt:
                      formatMsg = this.txtFormat(v)
                      break
                    case MsgType.picture:
                      formatMsg = this.pictureFormat(v)
                      break
                    case MsgType.inquirySheet:
                      formatMsg = this.inquirySheetFormat(v)
                      break
                    case MsgType.patientsThemselves:
                      formatMsg = this.patientsThemselvesFormat(v)
                      break
                    case MsgType.treatmentPlan:
                      formatMsg = this.treatmentPlanFormat(v)
                      break
                    case MsgType.audio:
                      formatMsg = this.audioFormat(v)
                      break
                    default:
                      break
                  }
                  if (formatMsg) {
                    return <View key={k}>{formatMsg.dom}</View>
                  }
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
                      <View style={style.bottomNavItemPicFa}>
                        <Image style={style.bottomNavItemPic} source={v.icon} />
                      </View>
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
                  <TouchableOpacity onPress={this.changeMode}>
                    <Image
                      style={style.bottomInputImg}
                      source={chatMode === "text" ? gImg.advisory.voice : gImg.advisory.text}
                    />
                  </TouchableOpacity>
                  {chatMode === "text" ? (
                    <>
                      <View style={style.inputFa}>
                        <TextareaItem
                          style={style.input}
                          placeholder="请输入"
                          autoHeight
                          clear
                          last
                          ref={ref => (this.msgInput = ref)}
                          value={this.state.sendMsg}
                          onChange={val => {
                            val = val || ""
                            this.setState({
                              sendMsg: val,
                            })
                          }}
                        />
                      </View>
                      <TouchableOpacity onPress={this.sendMsg}>
                        <Text
                          style={[style.bottomInputSendBtn, global.fontSize14, global.fontStyle]}>
                          发送
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                      <TouchableOpacity
                        style={{ width: "100%" }}
                        onPressIn={this.onRecordPressIn}
                        onPressOut={this.onRecordPressOut}>
                        <View
                          style={{
                            width: 150,
                            padding: 13,
                            alignItems: "center",
                            backgroundColor: isRecord ? sColor.white : sColor.mainRed,
                          }}>
                          <Text
                            style={{
                              color: isRecord ? sColor.color666 : sColor.white,
                            }}>
                            {isRecord ? "松开发送录音 " + recordTime : "按下录音"}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <View
                  style={[
                    this.state.isShowBottomPicSelect ? style.selectPicActive : style.selectPic,
                    global.flex,
                    global.alignItemsCenter,
                    global.justifyContentSpaceAround,
                  ]}>
                  <View style={style.selectPicFa}>
                    <View style={style.imgSelector}>
                      <ImagePicker
                        // onChange={this.selectPic}
                        files={this.state.selectPic}
                        onAddImageClick={() => {
                          try {
                            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
                              .then(async res => {
                                if (!res) {
                                  try {
                                    const granted = await PermissionsAndroid.request(
                                      PermissionsAndroid.PERMISSIONS.CAMERA,
                                      {
                                        title: "申请拍摄照片和录制视频权限",
                                        message:
                                          "博一健康需要使用您的拍摄照片和录制视频的权限,是否允许?",
                                        buttonNeutral: "稍后询问",
                                        buttonNegative: "禁止",
                                        buttonPositive: "允许",
                                      },
                                    )
                                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                                      console.log("获得摄像头权限")
                                      RnImagePicker.launchImageLibrary(imgPickerOpt, resp => {
                                        const uploadingImgKey = Toast.loading(
                                          "上传图片中",
                                          0,
                                          () => {},
                                          true,
                                        )
                                        if (resp.didCancel) {
                                          Portal.remove(uploadingImgKey)
                                        } else if (resp.error) {
                                          Portal.remove(uploadingImgKey)
                                          return Toast.info(
                                            "您禁止了拍摄照片和录制视频权限, 请到设置中心打开",
                                            3,
                                          )
                                        } else {
                                          uploadImg({ url: resp.uri })
                                            .then(json => {
                                              Portal.remove(uploadingImgKey)
                                              this.setState({
                                                isShowBottomNav: false,
                                                isShowBottomPicSelect: false,
                                              })
                                              const { patientUid } = this.state
                                              const { url, picId } = json.data
                                              this.props.ws.wsPost({
                                                url: "/ws/sendMsg",
                                                data: {
                                                  pic: {
                                                    url,
                                                    picId,
                                                  },
                                                  type: MsgType.picture,
                                                  patientUid,
                                                },
                                              })
                                            })
                                            .catch(e => {
                                              Portal.remove(uploadingImgKey)
                                              Toast.fail("上传图片, 错误信息: " + e)
                                            })
                                        }
                                      })
                                    } else {
                                      return Toast.info(
                                        "您禁止了拍摄照片和录制视频权限, 请到设置中心打开",
                                        3,
                                      )
                                    }
                                  } catch (err) {
                                    console.warn(err)
                                  }
                                } else {
                                  RnImagePicker.launchImageLibrary(imgPickerOpt, resp => {
                                    const uploadingImgKey = Toast.loading(
                                      "上传图片中",
                                      0,
                                      () => {},
                                      true,
                                    )
                                    if (resp.didCancel) {
                                      Portal.remove(uploadingImgKey)
                                    } else if (resp.error) {
                                      Portal.remove(uploadingImgKey)
                                      return Toast.info(
                                        "您禁止了拍摄照片和录制视频权限, 请到设置中心打开",
                                        3,
                                      )
                                    } else {
                                      uploadImg({ url: resp.uri })
                                        .then(json => {
                                          Portal.remove(uploadingImgKey)
                                          this.setState({
                                            isShowBottomNav: false,
                                            isShowBottomPicSelect: false,
                                          })
                                          const { patientUid } = this.state
                                          const { url, picId } = json.data
                                          this.props.ws.wsPost({
                                            url: "/ws/sendMsg",
                                            data: {
                                              pic: {
                                                url,
                                                picId,
                                              },
                                              type: MsgType.picture,
                                              patientUid,
                                            },
                                          })
                                        })
                                        .catch(e => {
                                          Portal.remove(uploadingImgKey)
                                          Toast.fail("上传图片, 错误信息: " + e)
                                        })
                                    }
                                  })
                                }
                              })
                              .catch(err => {
                                console.log("读取权限失败: " + err)
                              })
                          } catch (err) {
                            console.log(err)
                          }
                        }}
                      />
                    </View>
                    <Image source={gImg.advisory.selectPic} style={style.pickerImg} />
                    <Text style={[style.selectTitle, global.fontSize14, global.fontStyle]}>
                      图片
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={style.selectPicFa}
                    onPress={() => {
                      try {
                        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
                          .then(async res => {
                            if (!res) {
                              try {
                                const granted = await PermissionsAndroid.request(
                                  PermissionsAndroid.PERMISSIONS.CAMERA,
                                  {
                                    title: "申请拍摄照片和录制视频权限",
                                    message:
                                      "博一健康需要使用您的拍摄照片和录制视频的权限,是否允许?",
                                    buttonNeutral: "稍后询问",
                                    buttonNegative: "禁止",
                                    buttonPositive: "允许",
                                  },
                                )
                                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                                  console.log("获得摄像头权限")
                                  RnImagePicker.launchCamera(imgPickerOpt, resp => {
                                    const uploadingImgKey = Toast.loading(
                                      "上传图片中",
                                      0,
                                      () => {},
                                      true,
                                    )
                                    if (resp.didCancel) {
                                      Portal.remove(uploadingImgKey)
                                    } else if (resp.error) {
                                      Portal.remove(uploadingImgKey)
                                      return Toast.info(
                                        "您禁止了拍摄照片和录制视频权限, 请到设置中心打开",
                                        3,
                                      )
                                    } else {
                                      uploadImg({ url: resp.uri })
                                        .then(json => {
                                          Portal.remove(uploadingImgKey)
                                          this.setState({
                                            isShowBottomNav: false,
                                            isShowBottomPicSelect: false,
                                          })
                                          const { patientUid } = this.state
                                          const { url, picId } = json.data
                                          this.props.ws.wsPost({
                                            url: "/ws/sendMsg",
                                            data: {
                                              pic: {
                                                url,
                                                picId,
                                              },
                                              type: MsgType.picture,
                                              patientUid,
                                            },
                                          })
                                        })
                                        .catch(e => {
                                          Portal.remove(uploadingImgKey)
                                          Toast.fail("上传图片, 错误信息: " + e)
                                        })
                                    }
                                  })
                                } else {
                                  Toast.info("您禁止了拍摄照片和录制视频权限, 请到设置中心打开", 3)
                                }
                              } catch (err) {
                                console.warn(err)
                              }
                            } else {
                              RnImagePicker.launchCamera(imgPickerOpt, resp => {
                                const uploadingImgKey = Toast.loading(
                                  "上传图片中",
                                  0,
                                  () => {},
                                  true,
                                )
                                if (resp.didCancel) {
                                  Portal.remove(uploadingImgKey)
                                } else if (resp.error) {
                                  Portal.remove(uploadingImgKey)
                                  return Toast.info(
                                    "您禁止了拍摄照片和录制视频权限, 请到设置中心打开",
                                    3,
                                  )
                                } else {
                                  uploadImg({ url: resp.uri })
                                    .then(json => {
                                      Portal.remove(uploadingImgKey)
                                      this.setState({
                                        isShowBottomNav: false,
                                        isShowBottomPicSelect: false,
                                      })
                                      const { patientUid } = this.state
                                      const { url, picId } = json.data
                                      this.props.ws.wsPost({
                                        url: "/ws/sendMsg",
                                        data: {
                                          pic: {
                                            url,
                                            picId,
                                          },
                                          type: MsgType.picture,
                                          patientUid,
                                        },
                                      })
                                    })
                                    .catch(e => {
                                      Portal.remove(uploadingImgKey)
                                      Toast.fail("上传图片, 错误信息: " + e)
                                    })
                                }
                              })
                            }
                          })
                          .catch(err => {
                            console.log("读取权限失败: " + err)
                          })
                      } catch (err) {
                        console.log(err)
                      }
                    }}>
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
          <View style={style.howImgFa}>
            <View style={style.close}>
              <Icon
                onPress={() => {
                  this.setState({
                    imagesViewer: [
                      {
                        url: BASE_URL + "/static/media/collapsed_logo.db8ef9b3.png",
                      },
                    ],
                    isShowPic: false,
                  })
                }}
                style={style.closeIcon}
                name="close"
              />
            </View>
            <ImageViewer
              saveToLocalByLongPress={false}
              imageUrls={this.state.imagesViewer}
              index={this.state.imageIdx}
              maxOverflow={0}
              onCancel={() => {}}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }
  changeMode = () => {
    this.setState({
      chatMode: this.state.chatMode === "audio" ? "text" : "audio",
    })
  }
  getMsgList = async (
    page: number,
    limit: number,
    filter = { patientUid: this.state.patientUid },
  ) => {
    try {
      let {
        data: { list: msgList },
        count,
      } = await wsMsgApi.getMsgList({ page, limit, filter })
      let { patientUid } = this.state
      this.props.addMsgList({
        uid: patientUid,
        msgList,
      })
      this.setState({
        hasMoreRecord:
          this.props.ws.chatMsg[patientUid] && count > this.props.ws.chatMsg[patientUid].length,
      })
    } catch (err) {
      console.log(err)
    }
  }
  txtFormat = (serverMsg: Exclude<Msg, "dom">) => {
    let msg: Msg = serverMsg
    let isSelfMsg = msg.sendUser.uid === this.props.uid
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
                    ? { uri: getPicCdnUrl(msg.sendUser.avatar.url) }
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
                    ? { uri: getPicCdnUrl(msg.sendUser.avatar.url) }
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
                    ? { uri: getThumbUrl({ path: getPicFullUrl(msg.sendUser.avatar.url) }) }
                    : gImg.common.defaultAvatar
                }
              />
            </View>
            <View style={isSelfMsg ? global.hidden : style.leftItemIcon} />
            <TouchableOpacity
              style={style.leftItemPicture}
              onPress={() => this.openShowPic(getThumbUrl({ path: getPicFullUrl(msg.pic.url) }))}>
              <Image
                style={style.itemPicImg}
                source={
                  msg.pic.url
                    ? { uri: getThumbUrl({ path: getPicFullUrl(msg.pic.url) }) }
                    : gImg.common.defaultPic
                }
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
              onPress={() => this.openShowPic(getThumbUrl({ path: getPicFullUrl(msg.pic.url) }))}>
              <Image
                style={style.itemPicImg}
                source={
                  msg.pic.url
                    ? { uri: getThumbUrl({ path: getPicFullUrl(msg.pic.url) }) }
                    : gImg.common.defaultPic
                }
              />
            </TouchableOpacity>
            <View style={isSelfMsg ? style.rightItemIcon : global.hidden} />
            <View style={style.itemPic}>
              <Image
                style={style.itemImg}
                source={
                  msg.sendUser.avatar.url
                    ? { uri: getThumbUrl({ path: getPicFullUrl(msg.sendUser.avatar.url) }) }
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
  audioFormat = (serverMsg: Exclude<Overwrite<Msg, { file: File }>, "dom">) => {
    const { isPalyAudio, currAudioMsgId } = this.state
    let msg: Overwrite<Msg, { file: File }> = serverMsg
    let isSelfMsg = msg.sendUser.uid === this.state.info.id
    msg.dom = (
      <View>
        {isSelfMsg ? (
          <View style={isSelfMsg ? style.item : global.hidden}>
            <Text style={[style.sendTime, global.fontStyle, global.fontSize12]}>
              {msg.sendTime.substr(0, 16)}
            </Text>
            <View style={[style.leftItem, global.flex, global.justifyContentEnd]}>
              <TouchableOpacity
                style={style.rightAudio}
                onPress={() => this.startPlayAudio(msg.id, msg.file.url)}>
                <View style={{ alignItems: "flex-end", paddingRight: 10, width: 80 }}>
                  <Image
                    style={{ width: 15, height: 15 }}
                    source={
                      isPalyAudio && currAudioMsgId === msg.id
                        ? gImg.common.rightSoundPlaying
                        : gImg.common.rightSound
                    }
                  />
                </View>
              </TouchableOpacity>
              <View style={style.rightItemIcon} />
              <View style={style.itemPic}>
                <Image
                  style={style.itemImg}
                  source={
                    msg.sendUser.avatar.url
                      ? { uri: getThumbUrl({ path: getPicFullUrl(msg.sendUser.avatar.url) }) }
                      : gImg.common.defaultAvatar
                  }
                />
              </View>
            </View>
          </View>
        ) : (
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
                      ? { uri: getThumbUrl({ path: getPicFullUrl(msg.sendUser.avatar.url) }) }
                      : gImg.common.defaultAvatar
                  }
                />
              </View>
              <View style={isSelfMsg ? global.hidden : style.leftItemIcon} />
              <TouchableOpacity
                style={style.leftAudio}
                onPress={() => this.startPlayAudio(msg.id, msg.file.url)}>
                <View style={{ alignItems: "flex-start", paddingRight: 10, width: 80 }}>
                  <Image
                    style={{ width: 15, height: 15 }}
                    source={
                      isPalyAudio && currAudioMsgId === msg.id
                        ? gImg.common.leftSoundPlaying
                        : gImg.common.leftSound
                    }
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    )
    return msg
  }
  // 治疗方案
  treatmentPlanFormat = (
    serverMsg: Exclude<Overwrite<Msg, { extraData: TreatmentPlan }>, "dom">,
  ) => {
    let msg: Overwrite<Msg, { extraData: TreatmentPlan }> = serverMsg
    msg.dom = (
      <View style={style.treatmentPlan}>
        <Text style={[style.sendTime, global.fontStyle, global.fontSize12]}>{msg.sendTime}</Text>
        <View style={style.treatmentPlanCenter}>
          <View style={[style.treatmentPlanHeader, global.flex, global.alignItemsCenter]}>
            <Image style={style.treatmentPlanHeaderImg} source={gImg.common.injury} />
            <View style={style.treatmentPlanHeaderTitle}>
              <Text style={[style.treatmentPlanHeaderTheme, global.fontSize18]}>治疗方案</Text>
              <Text style={[style.treatmentPlanHeaderTime, global.fontSize14]}>{msg.sendTime}</Text>
            </View>
          </View>
          <DashLine len={45} backgroundColor={sColor.colorEee} width={windowWidth - 90} />
          <Text style={[style.treatmentPlanItem, global.fontSize14]}>
            患者 {msg.extraData.patient.name} ( {GENDER_ZH[msg.extraData.patient.gender]}{" "}
            {msg.extraData.patient.yearAge > 3
              ? msg.extraData.patient.yearAge + "岁"
              : msg.extraData.patient.yearAge + "岁" + msg.extraData.patient.monthAge + "月"}{" "}
            )
          </Text>
          <DashLine len={45} backgroundColor={sColor.colorEee} width={windowWidth - 90} />
          <Text style={[style.treatmentPlanItem, global.fontSize14]}>
            诊断 {msg.extraData.patient.discrimination};
            {msg.extraData.patient.syndromeDifferentiation}
          </Text>
          <DashLine len={45} backgroundColor={sColor.colorEee} width={windowWidth - 90} />
          <Text style={[style.treatmentPlanItem, global.fontSize14]}>
            根据治疗方案购买 服药, 并按时复诊
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.push(pathMap.SquareRootDetail, {
                prescriptionId: msg.extraData.id,
              })
            }}>
            <Text style={[style.treatmentPlanBtn, global.fontSize14]}>点此查看治疗方案</Text>
          </TouchableOpacity>
          <Image style={style.treatmentPlanFlag} source={gImg.common.flag} />
        </View>
      </View>
    )
    return msg
  }
  //问诊单
  inquirySheetFormat = (
    serverMsg: Exclude<Overwrite<Msg, { extraData: MsgInquirySheetData }>, "dom">,
  ) => {
    let msg: Overwrite<Msg, { extraData: MsgInquirySheetData }> = serverMsg
    msg.dom = (
      <View style={style.inquirySheet}>
        <Text style={[style.sendTime, global.fontStyle, global.fontSize12]}>{msg.sendTime}</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            this.props.navigation.push(pathMap.InquirySheet, {
              patientUid: msg.extraData.patient.id,
            })
          }
          style={style.inquirySheetContent}>
          <View style={[style.inquirySheetHeader, global.flex, global.alignItemsCenter]}>
            <Image style={style.inquirySheetHeaderImg} source={gImg.common.injury} />
            <View>
              <Text style={[style.inquirySheetHeaderTitle, global.fontSize18]}>
                {msg.extraData.patient.name}的问诊单
              </Text>
              <Text style={[style.inquirySheetHeaderTime, global.fontSize14]}>
                {msg.extraData.ctime}
              </Text>
            </View>
          </View>
          <DashLine backgroundColor={sColor.colorEee} len={45} width={windowWidth - 90} />
          <Text style={[style.inquirySheetPatient, global.fontSize14]}>
            患者 {msg.extraData.patient.name} ( {GENDER_ZH[msg.extraData.patient.gender]}{" "}
            {msg.extraData.patient.yearAge > 3
              ? msg.extraData.patient.yearAge + "岁"
              : msg.extraData.patient.yearAge + "岁" + msg.extraData.patient.monthAge + "月"}{" "}
            )
          </Text>
          <DashLine backgroundColor={sColor.colorEee} len={45} width={windowWidth - 90} />
          <Text style={[style.inquirySheetDetail, global.fontSize14]}>已提交问诊单, 请查看</Text>
          <Image style={style.inquirySheetFlag} source={gImg.common.flag} />
        </TouchableOpacity>
      </View>
    )
    return msg
  }
  //患者自述
  patientsThemselvesFormat = (
    serverMsg: Exclude<Overwrite<Msg, { extraData: PatientsThemselves }>, "dom">,
  ) => {
    let msg: Overwrite<Msg, { extraData: PatientsThemselves }> = serverMsg
    msg.dom = (
      <View style={style.patientsThemselves}>
        <Text style={[style.sendTime, global.fontStyle, global.fontSize12]}>{msg.sendTime}</Text>
        <View style={style.patientsThemselvesContent}>
          <View style={style.patientsThemselvesHeader}>
            <Text style={[style.patientsThemselvesHeaderTitle, global.fontSize18]}>
              {msg.extraData.patient.name}
            </Text>
            <View
              style={[style.patientsThemselvesHeaderPatient, global.flex, global.alignItemsCenter]}>
              <Text style={[style.patientsThemselvesHeaderPatientTitle, global.fontSize14]}>
                {GENDER_ZH[msg.extraData.patient.gender]}
              </Text>
              <View style={style.dot} />
              <Text style={[style.patientsThemselvesHeaderPatientTitle, global.fontSize14]}>
                {msg.extraData.patient.yearAge > 3
                  ? msg.extraData.patient.yearAge + "岁"
                  : msg.extraData.patient.yearAge + "岁" + msg.extraData.patient.monthAge + "月"}
              </Text>
              <View style={style.dot} />
              <Text style={[style.patientsThemselvesHeaderPatientTitle, global.fontSize14]}>
                {this.state.region.map(region => {
                  if (region.cid === msg.extraData.patient.provinceCid) {
                    return region.areaName
                  }
                })}
              </Text>
            </View>
          </View>
          <View
            style={[
              style.patientsThemeselvesPatient,
              global.flex,
              global.alignItemsCenter,
              global.justifyContentSpaceAround,
            ]}>
            <View>
              <Text style={[style.patientsThemeselvesPatientTitle, global.fontSize13]}>
                患者身高
              </Text>
              <Text style={[style.patientsThemeselvesPatientDetail, global.fontSize15]}>
                {msg.extraData.patient.height} cm
              </Text>
            </View>
            <View>
              <Text style={[style.patientsThemeselvesPatientTitle, global.fontSize13]}>
                患者体重
              </Text>
              <Text style={[style.patientsThemeselvesPatientDetail, global.fontSize15]}>
                {msg.extraData.patient.weight} kg
              </Text>
            </View>
          </View>
          <View style={style.patientsThemeselvesPatientItem}>
            <Text style={[style.patientsThemeselvesPatientTitle, global.fontSize13]}>过敏历史</Text>
            <Text style={[style.patientsThemeselvesPatientDetail, global.fontSize15]}>
              {msg.extraData.patient.allergyHistory}
            </Text>
          </View>
          <View style={style.patientsThemeselvesPatientItem}>
            <Text style={[style.patientsThemeselvesPatientTitle, global.fontSize13]}>既往病史</Text>
            <Text style={[style.patientsThemeselvesPatientDetail, global.fontSize15]}>
              {msg.extraData.patient.medicalHistory}
            </Text>
          </View>
          <View style={style.patientsThemeselvesPatientItem}>
            <Text style={[style.patientsThemeselvesPatientTitle, global.fontSize13]}>患者自述</Text>
            <Text style={[style.patientsThemeselvesPatientDetail, global.fontSize15]}>
              {msg.extraData.patient.state}
            </Text>
          </View>
          <View style={style.patientsThemeselvesPatientItem}>
            <Text style={[style.patientsThemeselvesPatientTitle, global.fontSize13]}>舌苔面照</Text>
            <View
              style={[
                style.patientsThemeselvesPatientPic,
                global.flex,
                global.alignItemsCenter,
                global.flexWrap,
              ]}>
              {msg.extraData.patient.tongueCoatingPics.map(v => {
                return (
                  <TouchableOpacity
                    key={v.id}
                    onPress={() => {
                      this.setState({
                        isShowPic: true,
                        showPicUrl: v.url,
                      })
                    }}>
                    <Image
                      style={style.patientsThemeselvesPatientImg}
                      source={v.url ? { uri: getPicCdnUrl(v.url) } : gImg.common.defaultPic}
                    />
                  </TouchableOpacity>
                )
              })}
              {msg.extraData.patient.tongueCoatingPics.length === 0 ? (
                <Text style={[style.patientsThemeselvesPatientTitle, global.fontSize13]}>暂无</Text>
              ) : null}
            </View>
            <Text style={[style.patientsThemeselvesPatientTitle, global.fontSize13]}>
              问诊单问题
            </Text>
            <Text style={[style.patientsThemeselvesPatientDetail, global.fontSize15]}>已提交</Text>
          </View>
        </View>
      </View>
    )
    return msg
  }
  startPlayAudio = (msgId: number, url: string) => {
    const { isPalyAudio } = this.state
    if (isPalyAudio && this.whoosh) {
      this.stopPlayAudio()
      return
    }
    this.whoosh = new Sound(getFileCdnUrl(url), Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("failed to load the sound", error)
        this.whoosh && this.whoosh.release()
        this.whoosh = null
        return
      }
      this.setState({
        currAudioMsgId: msgId,
        isPalyAudio: true,
      })
      // loaded successfully
      // console.log("duration in seconds: " + whoosh.getDuration())
      // Play the sound with an onEnd callback
      this.whoosh &&
        this.whoosh.play(success => {
          if (success) {
            console.log("successfully finished playing")
          } else {
            Toast.fail("播放音频失败")
          }
          this.setState(
            {
              isPalyAudio: false,
              currAudioMsgId: 0,
            },
            this.stopPlayAudio,
          )
        })
    })
  }
  stopPlayAudio = () => {
    const { isPalyAudio } = this.state
    if (isPalyAudio && this.whoosh) {
      this.whoosh.stop(() => {
        this.setState({
          isPalyAudio: false,
          currAudioMsgId: 0,
        })
        this.whoosh && this.whoosh.release()
        this.whoosh = null
      })
    }
  }
  getMoreMsgList = async () => {
    this.setState({ refreshing: true })
    const {
      ws: { chatMsg },
    } = this.props
    let { patientUid } = this.state
    let page = 1,
      limit = 8
    if (patientUid in chatMsg) {
      let msgCount = chatMsg[patientUid].length
      for (let i = 10; i > 0; i--) {
        if (msgCount % i === 0) {
          limit = i
          page = msgCount / limit + 1
          break
        }
      }
    }
    try {
      await this.getMsgList(page, limit)
      this.setState({ refreshing: false })
    } catch (err) {
      this.setState({ refreshing: false })
      Toast.fail("刷新失败,错误信息: " + err.msg)
    }
  }
  updateMsgList = async () => {
    this.setState({ refreshing: true })
    const {
      ws: { chatMsg },
    } = this.props
    let { patientUid } = this.state
    if (chatMsg[patientUid].length === 0) {
      return
    }
    const currUserLastMsgId = chatMsg[patientUid][chatMsg[patientUid].length - 1].id
    try {
      let {
        data: { list: msgList },
        count,
      } = await wsMsgApi.getMsgList({
        page: -1,
        limit: -1,
        filter: {
          patientUid,
          currUserLastMsgId,
        },
      })
      for (let msg of msgList) {
        this.props.addMsg({ msg, uid: patientUid })
      }
      this.setState({
        hasMoreRecord: chatMsg[patientUid] && count > chatMsg[patientUid].length,
        refreshing: false,
      })
    } catch (err) {
      this.setState({ refreshing: false })
      Toast.fail("刷新失败,错误信息: " + err.msg)
    }
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
        isShowBottomPicSelect: false,
      })
      v.title = "更多功能"
      v.icon = gImg.advisory.show
    } else if (v.title === "图片") {
      this.setState({
        isShowBottomPicSelect: !this.state.isShowBottomPicSelect,
      })
    } else if (v.title === "结束对话") {
      this.closeInquiry()
    } else if (v.title === "快捷回复") {
      this.quickReply()
    } else {
      console.log("正在进入开方页")
      this.props.navigation.push(v.link, {
        patientUid: this.state.patientUid,
      })
    }
  }
  sendMsg = () => {
    this.setState({
      shouldScrollToEnd: true,
      isShowBottomPicSelect: false,
    })
    if (this.state.sendMsg === "") {
      return
    }
    const { patientUid } = this.state
    if (
      this.props.ws.wsPost({ url: "/ws/sendMsg", data: { msg: this.state.sendMsg, patientUid } })
    ) {
      this.setState({
        sendMsg: "",
      })
      if (this.myScroll && this.state.shouldScrollToEnd) {
        this.myScroll.scrollToEnd()
        this.setState({
          shouldScrollToEnd: false,
        })
      }
      this.msgInput && this.msgInput.textAreaRef && this.msgInput.textAreaRef.blur()
    }
  }
  openShowPic = (url: string) => {
    this.setState({
      showPicUrl: getPicCdnUrl(url),
      imagesViewer: [
        {
          url: getPicCdnUrl(url),
        },
      ],
      isShowPic: true,
    })
  }
  closeShowPic = () => {
    this.setState({
      isShowPic: false,
      showPicUrl: "",
    })
  }
  selectPic = (files: Array<{}>, operationType: string) => {
    if (operationType === "add") {
      let key = Toast.loading("上传图片中")
      api
        .uploadImg(files[files.length - 1])
        .then(json => {
          if (typeof json === "object") {
            if (json.code === 0) {
              Portal.remove(key)
              this.setState({
                isShowBottomPicSelect: false,
              })
              const { patientUid } = this.state
              const { url, picId } = json.data
              this.props.ws.wsPost({
                url: "/ws/sendMsg",
                data: {
                  pic: {
                    url,
                    picId,
                  },
                  type: MsgType.picture,
                  patientUid,
                },
              })
            } else {
              Portal.remove(key)
              Toast.fail("上传图片失败,错误信息: " + json.msg, 3)
            }
          } else {
            Portal.remove(key)
            Toast.fail("上传图片失败,服务器错误", 3)
          }
        })
        .catch(err => {
          Portal.remove(key)
          Toast.fail("上传失败, 错误原因: " + err.msg + ", 请重试", 3)
          console.log(err)
        })
    }
  }
  requestReadExteralStorage = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Permission To Load Photos From External Storage",
            message:
              "Permissions have to be granted in order to list photos on your phones for you to choose.",
            buttonPositive: "",
          },
        )

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        } else {
          console.log("READ_EXTERNAL_STORAGE permission denied!")
        }
      } catch (err) {
        console.warn(err)
      }
    }
  }
  /**
   * 关闭问诊
   */
  closeInquiry = () => {
    const { patientUid } = this.state
    Modal.alert("结束会话", "确认结束会话将无法聊天, 是否结束会话?", [
      {
        text: "取消",
        onPress: () => console.log("cancel"),
        style: "cancel",
      },
      {
        text: "确认",
        onPress: () => {
          closeInquiry({ patientUid })
            .then(() => {
              DeviceEventEmitter.emit(pathMap.AdvisoryIndex + "Reload")
              this.props.navigation.navigate(pathMap.Home)
            })
            .catch(err => {
              Toast.fail("关闭失败,错误信息: " + err.msg)
            })
        },
      },
    ])
  }
  /**
   * 快捷回复
   */
  quickReply = () => {
    this.props.navigation.push(pathMap.QuickReply)
  }
}
