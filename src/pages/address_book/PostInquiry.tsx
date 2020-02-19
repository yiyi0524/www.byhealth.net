import * as userAction from '@/redux/actions/user'
import { AppState } from '@/redux/stores/store'
import consultation, { Msg } from '@/services/consultation'
import { getPicCdnUrl } from '@/utils/utils'
import { Toast } from '@ant-design/react-native'
import TextAreaItem from '@ant-design/react-native/lib/textarea-item'
import sColor from '@styles/color'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import React, { Component } from 'react'
import { Image, KeyboardAvoidingView, PixelRatio, Platform, RefreshControl, ScrollView, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { StackNavigationProp } from '@react-navigation/stack'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
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
  navigation: StackNavigationProp<any>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  canSendMsg: boolean
  id: number
  msg: string
  list: Msg[]
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PatientDetail extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = () => ({
    title: '诊后咨询',
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
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      textAlign: 'center',
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
      canSendMsg: true,
      id: this.props.navigation.getParam('id') || 0,
      msg: '',
      list: [],
    }
  }
  init = async () => {
    let { id, list } = this.state
    list = []
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
          canSendMsg: doctor.msgList.length < patient.msgList.length,
        })
        if (doctor.msgList.length > 0) {
          list.push({
            msg: doctor.msgList[0].msg,
            isPatient: false,
            avatar: doctor.avatar.url ? doctor.avatar.url : gImg.common.defaultAvatar,
          })
          if (patient.msgList.length > 1) {
            list.push({
              msg: patient.msgList[1].msg,
              isPatient: true,
              avatar: patient.avatar.url ? patient.avatar.url : gImg.common.defaultAvatar,
            })
            if (doctor.msgList.length > 1) {
              list.push({
                msg: doctor.msgList[1].msg,
                isPatient: false,
                avatar: doctor.avatar.url ? doctor.avatar.url : gImg.common.defaultAvatar,
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
    if (msg === '') {
      return
    }
    consultation
      .sendPostInquiryMsg({ id, msg })
      .then(() => {
        this.setState({ msg: '' }, this.init)
      })
      .catch(err => {
        Toast.fail('发送失败, 错误信息: ' + err.msg, 3)
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
        Toast.fail('刷新失败,错误信息: ' + err.msg)
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
    let { msg, list, canSendMsg } = this.state
    return (
      <>
        <KeyboardAvoidingView
          enabled={Platform.OS !== 'android'}
          behavior='padding'
          style={{ flex: 1 }}
          keyboardVerticalOffset={70}
        >
          <View style={style.main}>
            <View style={style.content}>
              <ScrollView
                refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
              >
                <View style={style.tips}>
                  <Text style={style.tipsTitle}>
                    提示: 每次问诊结束后,患者可以发起两次免费的诊后咨询,患者的每次咨询 您只可以回复一条消息,
                    请尽量一条消息发送完全
                  </Text>
                </View>
                <View style={style.list}>
                  {list.map((v, k) => {
                    let isParent = v.isPatient
                    if (isParent) {
                      return (
                        <View style={[global.flex, style.item]} key={k}>
                          <TouchableOpacity
                          // onPress={() =>
                          //   this.props.navigation.push(pathMap.AdvisoryMedicalRecord, {
                          //     patientUid: v.aa,
                          //     consultationId: navigation.getParam("consultationId"),
                          //   })
                          // }
                          >
                            <View style={style.avatarPar}>
                              <Image
                                style={style.avatar}
                                source={
                                  v.avatar ? { uri: getPicCdnUrl(v.avatar, 'avatar') } : gImg.common.defaultAvatar
                                }
                              />
                            </View>
                          </TouchableOpacity>
                          <View style={style.msgRight}>
                            <View style={style.icon} />
                            <Text style={[style.msg, global.fontSize14]}>{v.msg}</Text>
                          </View>
                        </View>
                      )
                    }
                    return (
                      <View style={[global.flex, style.right]} key={k}>
                        <View style={[style.avatarPar, style.rightAvatarPar]}>
                          <Image
                            style={style.avatar}
                            source={v.avatar ? { uri: getPicCdnUrl(v.avatar, 'avatar') } : gImg.common.defaultAvatar}
                          />
                        </View>
                        <View style={[style.msgRight, style.rightMsgRight]}>
                          <View style={[style.rightIcon]} />
                          <Text style={[style.msg, global.fontSize14]}>{v.msg}</Text>
                        </View>
                      </View>
                    )
                  })}
                </View>
              </ScrollView>
            </View>
            <View style={style.footer}>
              <View style={[style.container, global.flex, global.justifyContentSpaceBetween, global.alignItemsCenter]}>
                <View style={style.inputPar}>
                  <TextAreaItem
                    style={style.input}
                    placeholder='请输入'
                    autoHeight
                    editable={canSendMsg}
                    clear
                    last
                    value={msg}
                    onChange={val => {
                      let currMsg = val || ''
                      this.setState({
                        msg: currMsg,
                      })
                    }}
                  />
                </View>
                <TouchableOpacity style={style.btn} onPress={this.send}>
                  <Text style={style.btnTitle}>{canSendMsg ? '发送' : '请等待患者咨询'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </>
    )
  }
}
