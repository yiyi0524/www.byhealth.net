import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import { personalInfo } from "@/services/user"
import { InputItem, Toast } from "@ant-design/react-native"
import sColor from "@styles/color"
import gStyle from "@utils/style"
import React, { Component } from "react"
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { connect } from "react-redux"
import { Dispatch } from "redux"
const style = gStyle.personalCenter.ChangePwd
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
export default class Index extends Component<
  Props &
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = () => {
    return {
      title: "重新设置密码",
      headerStyle: {
        backgroundColor: sColor.lightGreen,
        height: 45,
        elevation: 0,
      },
      headerTintColor: sColor.white,
      headerTitleStyle: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        textAlign: "center",
      },
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
        <ScrollView
          style={style.main}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          <View style={style.list}>
            <View style={style.item}>
              <InputItem />
            </View>
            <View style={style.item}>
              <InputItem />
            </View>
            <View style={style.item}>
              <InputItem />
              <TouchableOpacity>
                <Text style={style.verification}>获取验证码</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </>
    )
  }
}
