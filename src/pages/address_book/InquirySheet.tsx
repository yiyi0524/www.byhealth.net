import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import { getPicFullUrl } from "@/utils/utils"
import { Toast } from "@ant-design/react-native"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import { Image, PixelRatio, RefreshControl, ScrollView, Text, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { Region } from "./PatientDetail"
import api from "@/services/api"
import patient, { inquirySheet } from "@/services/patient"
const style = gStyle.addressBook.InquirySheet
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
  isShowMode: boolean
  patientUid: number
  consultationId: number
  showImgUrl: any
  detail: inquirySheet
  region: Region[]
}
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class InquirySheet extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = () => ({
    title: "博一健康",
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
      isShowMode: false,
      patientUid: this.props.navigation.getParam("patientUid") || 0,
      consultationId: this.props.navigation.getParam("consultationId") || 0,
      showImgUrl: "",
      detail: {
        name: "",
        height: 0,
        weight: 0,
        allergyHistory: "", //过敏史
        medicalHistory: "", //病史
        state: "", //用户情况,症状与病情
        lingualSurfacePicList: [], //舌面照
        dialoguePicList: [], //对话照片
        problems: {
          type: 0,
          subjectList: [],
        }, //问题列表
      },
      region: [],
    }
  }
  init = async () => {
    try {
      let {
        data: { detail },
      } = await patient.getInquirySheet({
        patientUid: this.state.patientUid,
        consultationId: this.state.consultationId,
      })
      console.log(detail)
      let {
        data: { region },
      } = await api.getRegion()
      this.setState({
        hasLoad: true,
        region,
        detail,
      })
    } catch (err) {
      console.log(err)
    }
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
  showImg = (img: string) => {
    this.setState({
      showImgUrl: img,
      isShowMode: true,
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
    const { detail } = this.state
    return (
      <View style={style.detail}>
        <ScrollView
          style={style.main}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          <View style={style.patientInfo}>
            <Text style={[style.patientInfoName, global.fontSize18]}>{detail.name}</Text>
            <View style={[global.flex, global.alignItemsCenter, global.justifyContentSpaceAround]}>
              <View style={style.patientInfoHeight}>
                <Text style={[style.patientInfoTitle, global.fontSize13]}>身高</Text>
                <Text style={[style.patientInfoDetail, global.fontSize14]}>{detail.height}cm</Text>
              </View>
              <View style={style.patientInfoHeight}>
                <Text style={[style.patientInfoTitle, global.fontSize13]}>体重</Text>
                <Text style={[style.patientInfoDetail, global.fontSize14]}>{detail.weight}kg</Text>
              </View>
            </View>
            <View style={style.patientInfoHeight}>
              <Text style={[style.patientInfoTitle, global.fontSize13]}>过敏史</Text>
              <Text style={[style.patientInfoDetail, global.fontSize14]}>
                {detail.allergyHistory}
              </Text>
            </View>
            <View style={style.patientInfoHeight}>
              <Text style={[style.patientInfoTitle, global.fontSize13]}>既往病史</Text>
              <Text style={[style.patientInfoDetail, global.fontSize14]}>
                {detail.medicalHistory}
              </Text>
            </View>
            <View style={style.patientInfoHeight}>
              <Text style={[style.patientInfoTitle, global.fontSize13]}>患者自述</Text>
              <Text style={[style.patientInfoDetail, global.fontSize14]}>{detail.state}</Text>
            </View>
          </View>
          {/* <View style={style.patientPic}>
            <Text style={[style.patientPicTitle, global.fontSize14]}>舌面照及其他资料</Text>
            <View
              style={[style.patientPicList, global.flex, global.alignItemsCenter, global.flexWrap]}>
              {detail.lingualSurfacePicList.map(v => {
                return (
                  <TouchableOpacity
                    key={v.id}
                    onPress={() => {
                      this.showImg(v.url)
                    }}>
                    <Image
                      style={style.patientImg}
                      source={v.url ? { uri: getPicFullUrl(v.url) } : gImg.common.defaultPic}
                    />
                  </TouchableOpacity>
                )
              })}
            </View>
          </View> */}
          <View style={style.patientPic}>
            <Text style={[style.patientPicTitle, global.fontSize14]}>对话照片</Text>
            <View
              style={[style.patientPicList, global.flex, global.alignItemsCenter, global.flexWrap]}>
              {detail.dialoguePicList.map(v => {
                return (
                  <TouchableOpacity
                    key={v.id}
                    onPress={() => {
                      this.showImg(v.url)
                    }}>
                    <Image
                      style={style.patientImg}
                      source={v.url ? { uri: getPicFullUrl(v.url) } : gImg.common.defaultPic}
                    />
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
          <View style={style.problems}>
            <Text style={[style.theme, global.fontSize16]}>问诊单问题</Text>
            {detail.problems.subjectList.map((v, k: number) => {
              return (
                <View style={style.problem} key={k}>
                  <Text style={[style.problemTitle, global.fontSize14]}>
                    {k + 1 + "." + v.title}
                  </Text>
                  <Text style={[style.problemDetail, global.fontSize14]}>
                    {v.options.map((v1, k1) => {
                      for (let v2 of v.answer) {
                        if (k1 === v2) {
                          return v1.title + "、"
                        }
                      }
                    })}
                  </Text>
                </View>
              )
            })}
          </View>
        </ScrollView>
        {/* 图片查看器 */}
        <View style={this.state.isShowMode ? style.showMode : global.hidden}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                isShowMode: false,
                showImgUrl: "",
              })
            }}>
            <Image
              style={style.showImg}
              source={
                this.state.showImgUrl
                  ? { uri: getPicFullUrl(this.state.showImgUrl) }
                  : gImg.common.defaultAvatar
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
