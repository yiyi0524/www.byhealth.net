import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import { Icon, Toast } from "@ant-design/react-native"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import {
  Image,
  PixelRatio,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Linking,
} from "react-native"
import DeviceInfo from "react-native-device-info"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import pathMap from "@/routes/pathMap"
import { isDebugMode } from "@/utils/utils"
import { checkUpdate } from "@/services/api"
const style = gStyle.personalCenter.about
const global = gStyle.global
interface Props {
  navigation: any
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  version: string
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
export default class About extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = () => {
    return {
      title: "关于我们",
      headerStyle: {
        backgroundColor: sColor.white,
        height: 45,
        elevation: 0,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: sColor.colorDdd,
      },
      headerTintColor: sColor.color333,
      headerTitleStyle: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        textAlign: "center",
      },
      headerRight: <Text />,
    }
  }
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      version: "",
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    const version = DeviceInfo.getReadableVersion()
    this.setState({
      hasLoad: true,
      version,
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
  checkedVersion = () => {
    if (!isDebugMode()) {
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
          } else {
            Toast.success("当前已是最新版本!", 1)
          }
        })
        .catch(e => {
          console.log(e)
        })
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
      <View style={style.about}>
        <ScrollView
          style={style.main}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          <View style={style.header}>
            <View style={style.headerImgFa}>
              <Image style={style.headerImg} source={gImg.common.logo} />
            </View>
            <Text style={[style.headerTitle, global.fontSize14]}>博一健康医生版</Text>
            <Text style={[style.headerVersion, global.fontSize12]}>版本{this.state.version}</Text>
          </View>
          {/* <TouchableOpacity onPress={this.checkedVersion}>
            <Text style={[style.checkedVersion, global.fontSize14]}>检测更新</Text>
          </TouchableOpacity> */}
          <View
            style={[
              style.weixin,
              global.flex,
              global.alignItemsCenter,
              global.justifyContentCenter,
            ]}>
            <Icon style={style.weixinLogo} name="wechat" />
            <Text style={[style.weixinTitle, global.fontSize14]}>微信公众号: 博一健康管理</Text>
          </View>
        </ScrollView>
        <View style={style.bottom}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.push(pathMap.RegisterAgreement)
            }}>
            <Text style={[style.agreement, global.fontSize14]}>医生注册协议</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.push(pathMap.LawAgreement)
            }}>
            <Text style={[style.agreement, global.fontSize14]}>法律申明与隐私政策</Text>
          </TouchableOpacity>
          <Text style={[style.footer, global.fontSize12]}>©2019 博一健康</Text>
        </View>
      </View>
    )
  }
}
