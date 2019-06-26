import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import { Toast } from "@ant-design/react-native"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import {
  Image,
  PixelRatio,
  RefreshControl,
  ScrollView,
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
} from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import TextAreaItem from "@ant-design/react-native/lib/textarea-item"
import consultation, { Msg } from "@/services/consultation"
import { getPicFullUrl } from "@/utils/utils"
const style = gStyle.addressBook.postInquiry
const global = gStyle.global

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
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  isToSendMsg: boolean
  id: number
  msg: string
  list: Msg[]
}

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class PatientDetail extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = () => ({
    title: "诊后咨询",
    headerStyle: {
      backgroundColor: sColor.white,
      height: 50,
      elevation: 0,
      color: sColor.mainBlack,
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
    headerRight: <TouchableOpacity />,
  })
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      isToSendMsg: true,
      id: this.props.navigation.getParam("id") || 0,
      msg: "",
      list: [],
    }
  }
  init = async () => {
    let { id, list } = this.state
    try {
      let {
        data: { patient, doctor },
      } = await consultation.getPostInquiry({ doctorPatientId: id })
      if (patient.msgList.length > 0) {
        list.push({
          msg: patient.msgList[0].msg,
          isPatient: true,
          avatar: patient.avatar.url ? patient.avatar.url : gImg.common.defaultAvatar,
        })
        this.setState({
          isToSendMsg: true,
        })
        if (doctor.msgList.length > 0) {
          list.push({
            msg: doctor.msgList[0].msg,
            isPatient: false,
            avatar: patient.avatar.url ? patient.avatar.url : gImg.common.defaultAvatar,
          })
          this.setState({
            isToSendMsg: false,
          })
          if (patient.msgList.length > 1) {
            list.push({
              msg: patient.msgList[1].msg,
              isPatient: true,
              avatar: patient.avatar.url ? patient.avatar.url : gImg.common.defaultAvatar,
            })
            this.setState({
              isToSendMsg: true,
            })
            if (doctor.msgList.length > 1) {
              list.push({
                msg: doctor.msgList[1].msg,
                isPatient: false,
                avatar: patient.avatar.url ? patient.avatar.url : gImg.common.defaultAvatar,
              })
              this.setState({
                isToSendMsg: false,
              })
            }
          }
        }
      }
      this.setState({
        list,
        hasLoad: true,
      })
    } catch (err) {
      console.log(err)
    }
  }
  send = () => {
    let { msg, id } = this.state
    if (msg === "") {
      return
    }
    consultation
      .sendPostInquiryMsg({ id, msg })
      .then(() => {
        Toast.loading("发送成功", 2, () => {
          this.init()
        })
      })
      .catch(err => {
        Toast.fail("发送失败, 错误信息: " + err.msg, 3)
      })
  }
  componentDidMount() {
    this.init()
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
          <View style={style.loadingPic}>
            <Image style={style.loadingImg} source={gImg.common.loading} />
          </View>
        </View>
      )
    }
    let { msg, list } = this.state
    return (
      <>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }} keyboardVerticalOffset={70}>
          <View style={style.main}>
            <View style={style.content}>
              <ScrollView
                refreshControl={
                  <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
                }>
                <View style={style.tips}>
                  <Text style={style.tipsTitle}>
                    提示: 您只能与患者发送两次诊后咨询, 请谨慎输入您要发送的信息
                  </Text>
                </View>
                <View style={style.list}>
                  {list.map((v, k) => {
                    let isParent = v.isPatient
                    if (isParent) {
                      return (
                        <View style={[global.flex, style.item]} key={k}>
                          <View style={style.avatarPar}>
                            <Image
                              style={style.avatar}
                              source={
                                v.avatar
                                  ? { uri: getPicFullUrl(v.avatar) }
                                  : gImg.common.defaultAvatar
                              }
                            />
                          </View>
                          <View style={style.msgRight}>
                            <View style={style.icon} />
                            <Text style={[style.msg, global.fontSize14]}>{v.msg}</Text>
                          </View>
                        </View>
                      )
                    } else {
                      return (
                        <View style={[global.flex, style.right]} key={k}>
                          <View style={[style.avatarPar, style.rightAvatarPar]}>
                            <Image
                              style={style.avatar}
                              source={
                                v.avatar
                                  ? { uri: getPicFullUrl(v.avatar) }
                                  : gImg.common.defaultAvatar
                              }
                            />
                          </View>
                          <View style={[style.msgRight, style.rightMsgRight]}>
                            <View style={[style.rightIcon]} />
                            <Text style={[style.msg, global.fontSize14]}>{v.msg}</Text>
                          </View>
                        </View>
                      )
                    }
                  })}
                </View>
              </ScrollView>
            </View>
            <View style={style.footer}>
              <View
                style={[
                  style.container,
                  global.flex,
                  global.justifyContentSpaceBetween,
                  global.alignItemsCenter,
                ]}>
                <View style={style.inputPar}>
                  <TextAreaItem
                    style={style.input}
                    placeholder="请输入"
                    autoHeight
                    editable={this.state.isToSendMsg}
                    clear
                    last
                    value={msg}
                    onChange={val => {
                      val = val || ""
                      this.setState({
                        msg: val,
                      })
                    }}
                  />
                </View>
                <TouchableOpacity style={style.btn} onPress={this.send}>
                  <Text style={style.btnTitle}>发送</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </>
    )
  }
}
