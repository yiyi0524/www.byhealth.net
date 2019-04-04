import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import { Icon, Toast, Portal } from "@ant-design/react-native"
import sColor from "@styles/color"
import gStyle from "@utils/style"
import React, { Component } from "react"
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  PixelRatio,
  Image,
} from "react-native"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import gImg from "@utils/img"
const style = gStyle.personalCenter.about
const global = gStyle.global
interface Props {
  navigation: any
}
interface State {
  hasLoad: boolean
  refreshing: boolean
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
  Props &
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>,
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
    }
  }
  async componentDidMount() {
    await this.init()
  }
  init = async () => {
    this.setState({
      hasLoad: true,
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
    const key = Toast.loading("正在检测新版本...", 3)
    // Portal.remove(key)
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
      <View style={style.about}>
        <ScrollView
          style={style.main}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          <View style={style.header}>
            <Image style={style.headerImg} source={gImg.common.logo} />
            <Text style={[style.headerTitle, global.fontSize14]}>
              博一健康医生版
            </Text>
            <Text style={[style.headerVersion, global.fontSize12]}>
              版本1.0.0
            </Text>
          </View>
          <TouchableOpacity onPress={this.checkedVersion}>
            <Text style={[style.checkedVersion, global.fontSize14]}>
              检测更新
            </Text>
          </TouchableOpacity>
          <View
            style={[
              style.weixin,
              global.flex,
              global.alignItemsCenter,
              global.justifyContentCenter,
            ]}
          >
            <Icon style={style.weixinLogo} name="wechat" />
            <Text style={[style.weixinTitle, global.fontSize14]}>
              微信公众号: 博一健康管理
            </Text>
          </View>
        </ScrollView>
        <View style={style.bottom}>
          <TouchableOpacity>
            <Text style={[style.agreement, global.fontSize14]}>
              医生注册协议
            </Text>
          </TouchableOpacity>
          <Text style={[style.footer, global.fontSize12]}>©2019 博一健康</Text>
        </View>
      </View>
    )
  }
}
