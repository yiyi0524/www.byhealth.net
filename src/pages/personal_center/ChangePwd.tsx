import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import api from "@/services/api"
import { InputItem, Toast } from "@ant-design/react-native"
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
} from "react-native"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
const style = gStyle.personalCenter.changePwd
const global = gStyle.global
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  oriPwd: string
  newPwd: string
  rePwd: string
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
export default class ChangePwd extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = () => {
    return {
      title: "重新设置密码",
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
      hasLoad: true,
      refreshing: false,
      oriPwd: "",
      newPwd: "",
      rePwd: "",
    }
  }
  componentDidMount() {
    this.init()
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

  comfirePwd = () => {
    if (this.state.newPwd !== this.state.rePwd) {
      Toast.fail("两次密码不一致", 3)
    }
  }
  submit = () => {
    if (this.state.oriPwd === "") {
      return Toast.info("请输入原密码", 3)
    }
    if (this.state.newPwd === "") {
      return Toast.info("请输入新密码", 3)
    }
    if (this.state.rePwd === "") {
      return Toast.info("再次输入密码", 3)
    }
    if (this.state.rePwd !== this.state.newPwd) {
      return Toast.info("两次密码不一致", 3)
    }
    let oriPwd = this.state.oriPwd,
      newPwd = this.state.newPwd,
      rePwd = this.state.rePwd
    api
      .modifyPwdWithOriPwd({ oriPwd, newPwd, rePwd })
      .then(() => {
        Toast.success("修改成功", 1, () => {
          this.setState(this.getInitState())
        })
      })
      .catch(err => {
        Toast.fail("修改失败, 错误信息: " + err.msg, 3)
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
      <ScrollView
        style={style.main}
        keyboardShouldPersistTaps="always"
        refreshControl={
          <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
        }>
        <View style={style.list}>
          <View style={style.item}>
            <InputItem
              clear
              value={this.state.oriPwd}
              placeholder="原密码"
              type="password"
              style={style.input}
              onChange={oriPwd => {
                this.setState({
                  oriPwd,
                })
              }}
            />
          </View>
          <View style={style.item}>
            <InputItem
              clear
              value={this.state.newPwd}
              placeholder="6位以上新密码"
              type="password"
              style={style.input}
              onChange={newPwd => {
                this.setState({
                  newPwd,
                })
              }}
            />
          </View>
          <View style={style.item}>
            <InputItem
              clear
              value={this.state.rePwd}
              placeholder="再次输入密码"
              type="password"
              style={style.input}
              onChange={rePwd => {
                this.setState({
                  rePwd,
                })
              }}
              onBlur={this.comfirePwd}
            />
          </View>
          <TouchableOpacity onPress={this.submit}>
            <Text style={[style.btn, global.fontSize14]}>确定</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}
