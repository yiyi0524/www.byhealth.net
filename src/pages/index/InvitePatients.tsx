import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import { TECHNICAL_TITLE_ZH } from "@/services/doctor"
import { Toast } from "@ant-design/react-native"
import userApi from "@api/user"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import { Image, PixelRatio, RefreshControl, Text, View } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import QRCode from "react-native-qrcode"
import { BASE_URL } from "@/config/api"
const style = gStyle.index.InvitePatients
const global = gStyle.global
interface NavParams {
  navigatePress: () => void
  mode: "delete" | "done"
}
interface Props {
  navigation: NavigationScreenProp<State, NavParams>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  doctorId: number
  name: string
  technicalTitle: number
  inviteUrl: string
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
export default class InvitePatients extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = ({
    navigation,
  }: {
    navigation: NavigationScreenProp<State, NavParams>
  }) => ({
    title: "二维码名片",
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
    headerRight: (
      <TouchableOpacity
        onPress={() => {
          navigation.state.params!.navigatePress()
        }}>
        <Text style={[style.headerRight, global.fontSize14]}>保存</Text>
      </TouchableOpacity>
    ),
  })
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      doctorId: 0,
      technicalTitle: 0,
      name: "",
      inviteUrl: BASE_URL + "/doctor",
    }
  }
  async componentDidMount() {
    await this.init()
    this.props.navigation.setParams({
      navigatePress: this.saveBusinessCard,
    })
  }
  /**
   * TODO 保存名片
   * 样式:     姓名
   *          职称
   *         二维码
   *       微信扫描上方二维码, 随时复诊
   */
  saveBusinessCard = () => {
    Toast.info("保存成功", 1)
  }
  init = async () => {
    let { data } = await userApi.getPersonalInfo()
    this.setState({
      hasLoad: true,
      doctorId: data.doctorInfo.id,
      name: data.info.name,
      technicalTitle: data.doctorInfo.technicalTitle as number,
      inviteUrl: BASE_URL + "/doctor/inquiry?source=scan&id=" + data.doctorInfo.id,
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
  shareBusinessCard = async () => {
    Toast.info("分享", 1)
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
      <View style={style.invitePatient}>
        <ScrollView
          style={style.main}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          <View style={style.invite}>
            <Text style={[style.title, global.fontSize16]}>{this.state.name}</Text>
            <Text style={[style.detail, global.fontSize12]}>
              {TECHNICAL_TITLE_ZH[this.state.technicalTitle]}
            </Text>
            <Text style={[style.detail, global.fontSize14]}>在家随时找我</Text>
            <Text style={[style.title, global.fontSize24]}>复诊调方</Text>
            <View style={style.qrCode}>
              <QRCode value={this.state.inviteUrl} size={120} bgColor="#252525" fgColor="white" />
            </View>
            <Text style={[style.detail, global.fontSize12]}>微信扫描上方我的二维码</Text>
            <Text style={[style.detail, global.fontSize12]}>关注 | 博一健康管理 | 公众号</Text>
            <Text style={[style.detail, global.fontSize12]}>
              即可随时在微信与我沟通, 在家找我复诊、调方
            </Text>
            <View style={style.logo}>
              <Image style={style.logoImg} source={gImg.common.logo} />
              <Text style={[style.detail, global.fontSize12]}>医生的个人线上医馆</Text>
            </View>
          </View>
        </ScrollView>
        {/* <View style={style.share}>
          <TouchableOpacity onPress={this.shareBusinessCard}>
            <Text style={[style.shareTitle, global.fontSize14]}>分享二维码名片</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    )
  }
}
